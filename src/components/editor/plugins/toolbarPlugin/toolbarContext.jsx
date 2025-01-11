import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

//-----------------------

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

export const BlockTypeToBlockName = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    paragraph: 'paragraph',
    bullet: 'bullet',
    number: 'number',
    quote: 'quote',
    code: 'code'
};

const INITIAL_TOOLBAR_STATE = {
    bgColor: '#fff',
    blockType: 'paragraph',
    canRedo: false,
    canUndo: false,
    codeLanguage: '',
    elementFormat: 'left',
    fontColor: '#000',
    fontFamily: 'Arial',
    // Current font size in px
    fontSize: `${DEFAULT_FONT_SIZE}px`,
    // Font size input value - for controlled input
    fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
    isBold: false,
    isCode: false,
    isImageCaption: false,
    isItalic: false,
    isLink: false,
    isRTL: false,
    isStrikethrough: false,
    isSubscript: false,
    isSuperscript: false,
    isUnderline: false,
    isLowercase: false,
    isUppercase: false,
    isCapitalize: false,
    rootType: 'root'
};

const Context = createContext(undefined);

export const ToolbarContext = ({ children }) => {
    const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE);
    const selectionFontSize = toolbarState.fontSize;

    const updateToolbarState = useCallback((key, value) => {
        setToolbarState((prev) => ({
            ...prev,
            [key]: value,
        }));
    },
        [],
    );

    useEffect(() => {
        updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2));
    }, [selectionFontSize, updateToolbarState]);

    const contextValue = useMemo(() => {
        return {
            toolbarState,
            updateToolbarState,
        };
    }, [toolbarState, updateToolbarState]);

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};


ToolbarContext.propTypes = {
    children: PropTypes.any
}

export const useToolbarState = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useToolbarState must be used within a ToolbarProvider');
    }

    return context;
};