import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// UI library Imports

// Lexical Imports
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// Lexical Plugins
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

// Editor imports
import EditorTheme from "./themes/editorTheme";
import ToolbarPlugin from './plugins/toolbarPlugin';
import SavePlugin from "./plugins/savePlugin";
import JoinLinesPlugin from "./plugins/joinLinesPlugin";
import AutoLinkPlugin from "./plugins/autoLink.Plugin";
import LinkPlugin from "./plugins/link.Plugin";
import ImagesPlugin from "./plugins/imagesPlugin";
import HorizontalRulePlugin from "./plugins/horizontalRulePlugin";
import ControlledValuePlugin from "./plugins/controlledValuePlugin";
import EditorNodes from './nodes';
import DraggableBlockPlugin from './plugins/draggableBlockPlugin';
import { ToolbarContext } from './plugins/toolbarPlugin/toolbarContext';
import AutocompletePlugin from './plugins/autocompletePlugin';

// UI Library Imports
import { useLocalStorage } from '@mantine/hooks';

// Local Imports
import { languages } from '@/i18n';
import classes from './editor.module.css';
import FloatingTextFormatToolbarPlugin from './plugins/floatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from './plugins/floatingLinkEditorPlugin';
import AutoCorrectPlugin from './plugins/autoCorrectPlugin';
import SpellCheckerPlugin from './plugins/spellCheckerPlugin';
import MarkdownTransformers from './transformers';
//-----------------------------------------

const EMPTY_CONTENT =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
// ------------------------------------------------------

// eslint-disable-next-line react-refresh/only-export-components
export const EditorFormat = {
    Raw: "raw",
    Markdown: "markdown"
}

const Placeholder = ({ children }) => {
    return (
        <div className="editorPlaceholder" data-ft="placeholder">
            {children}
        </div>
    );
}

Placeholder.propTypes = {
    children: PropTypes.any
}
// ------------------------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const DefaultConfiguration = {
    richText: false,
    format: EditorFormat.Raw,
    language: "en",
    placeholder: null,
    autocompleteEnabled: false,
    toolbar: {
        fonts: null,
        defaultFont: null,
        showAlignment: true,
        showBlockFormat: true,
        showFontFormat: true,
        showInsert: true,
        showListFormat: true,
        showUndoRedo: true,
        showExtraFormat: true,
        showInsertLink: true,
        showSave: false,
        showZoom: false,
        showViewFont: false,
    },
    spellchecker: {
        enabled: false,
        language: "en",
        punctuationCorrections: null,
        autoCorrections: null,
        wordList: null,
    },
};
// ------------------------------------------------------

const Editor = ({ language, defaultValue, onSave = () => { }, onChange = () => { }, configuration = DefaultConfiguration }) => {
    const direction = useMemo(() => languages[language]?.dir ?? 'ltr', [language]);
    const onError = (error) => console.error(error);
    const isRtl = useMemo(() => direction == "rtl" ? true : false, [direction]);
    const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
    const [isLinkEditMode, setIsLinkEditMode] = useState(false);
    const [zoom] = useLocalStorage({
        key: "editor-text-zoom",
        defaultValue: 100
    });
    const [viewFont] = useLocalStorage({
        key: "editor-view-font",
        defaultValue: null
    });
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    // ---- State Management ------
    const editorState = useMemo(() => !defaultValue || defaultValue === EMPTY_CONTENT
        ? configuration.format == EditorFormat.Markdown
            ? " "
            : EMPTY_CONTENT
        : defaultValue === EMPTY_CONTENT, [configuration.format, defaultValue]);

    // ----- Editor configuration -----
    const initialConfig = {
        namespace: "TextEditor",
        editorState: () => {
            return configuration.format === EditorFormat.Markdown && editorState
                ? $convertFromMarkdownString(editorState ?? "", MarkdownTransformers)
                : editorState;
        },
        nodes: [...EditorNodes],
        theme: EditorTheme,
        onError,
    };

    return (<div className={classes.editorShell} style={{ direction: direction }}>
        <ToolbarContext>
            <LexicalComposer initialConfig={initialConfig}>
                {configuration.richText && (
                    <ToolbarPlugin
                        configuration={configuration}
                        setIsLinkEditMode={setIsLinkEditMode}
                        locale={language}
                    />
                )}
                {configuration.richText ? (
                    <>
                        <RichTextPlugin
                            contentEditable={
                                <div className={classes.editorScroller}>
                                    <div className={classes.editor} ref={onRef}>
                                        <ContentEditable className={classes.contentEditableRoot}
                                            style={{ zoom: `${zoom}%`, fontFamily: viewFont }} />
                                    </div>
                                </div>
                            }
                            placeholder={
                                <Placeholder>
                                    {configuration.placeholder}
                                </Placeholder>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <ListPlugin />
                        <CheckListPlugin />
                        <AutoLinkPlugin />
                        <LinkPlugin />
                        <HorizontalRulePlugin />
                        {floatingAnchorElem && (
                            <>
                                <DraggableBlockPlugin anchorElem={floatingAnchorElem} isRtl={isRtl} />
                                <FloatingLinkEditorPlugin
                                    anchorElem={floatingAnchorElem}
                                    isLinkEditMode={isLinkEditMode}
                                    setIsLinkEditMode={setIsLinkEditMode}
                                />
                                <FloatingTextFormatToolbarPlugin
                                    anchorElem={floatingAnchorElem}
                                    setIsLinkEditMode={setIsLinkEditMode}
                                    configuration={configuration}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <PlainTextPlugin
                        contentEditable={<ContentEditable className={classes.contentEditableRoot} />}
                        placeholder={
                            <Placeholder>
                                {configuration.placeholder}
                            </Placeholder>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                )}
                <HistoryPlugin />
                <ImagesPlugin />
                <AutoCorrectPlugin
                    locale={language}
                    language={
                        configuration.spellchecker.language || configuration.language
                    }
                    configuration={configuration.spellchecker}
                />
                <SpellCheckerPlugin
                    locale={language}
                    language={
                        configuration.spellchecker.language || configuration.language
                    }
                    configuration={configuration.spellchecker}
                />
                {configuration.autocompleteEnabled && <AutocompletePlugin language={
                    configuration.spellchecker.language || configuration.language
                } />}
                <SavePlugin onSave={onSave} format={configuration.format} />
                <JoinLinesPlugin />
                <SelectionAlwaysOnDisplay />
                <ControlledValuePlugin
                    value={defaultValue}
                    onChange={onChange}
                    format={configuration.format}
                    isRichtext={configuration.richText}
                />
                {configuration.format == EditorFormat.Markdown && (
                    <MarkdownShortcutPlugin transformers={MarkdownTransformers} />
                )}
            </LexicalComposer>
        </ToolbarContext>
    </div>)
}

Editor.propTypes = {
    language: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    configuration: PropTypes.shape({
        richText: PropTypes.bool,
        format: PropTypes.string,
        language: PropTypes.string,
        placeholder: PropTypes.string,
        autocompleteEnabled: PropTypes.bool,
        toolbar: PropTypes.shape({
            fonts: PropTypes.arrayOf(PropTypes.string),
            defaultFont: PropTypes.string,
            showAlignment: PropTypes.bool,
            showBlockFormat: PropTypes.bool,
            showFontFormat: PropTypes.bool,
            showInsert: PropTypes.bool,
            showListFormat: PropTypes.bool,
            showUndoRedo: PropTypes.bool,
            showExtraFormat: PropTypes.bool,
            showInsertLink: PropTypes.bool,
            showSave: PropTypes.bool,
            showZoom: PropTypes.bool,
            showViewFont: PropTypes.bool,
        }),
        spellchecker: PropTypes.shape({
            enabled: PropTypes.bool,
            language: PropTypes.string,
            punctuationCorrections: PropTypes.func,
            autoCorrections: PropTypes.func,
            wordList: PropTypes.func,
        }),
    })
};
export default Editor;
