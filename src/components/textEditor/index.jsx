import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { useLocalStorage } from 'usehooks-ts';


//-----------------------------------------
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    imagePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    InsertImage,
    InsertThematicBreak,
    ListsToggle,
    ButtonWithTooltip,
    Select,
    Separator,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

// Local import

import { FaSave, MdOutlineZoomIn, MdOutlineZoomOut } from '/src/icons';
import { Alert, Space, Button } from 'antd';
import useUnsavedChanges from '/src/hooks/useUnsavedChanges';
import {
    useGetPunctuationQuery,
    useGetAutoCorrectQuery
} from "/src/store/slices/toolsSlice";

import Loading from "/src/components/common/loader";
import Error from '/src/components/common/error';

import { getFonts } from '/src/lang';

//-----------------------------------------
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
//-----------------------------------------

const useStyles = createUseStyles({
    contentEditable: {
        fontFamily: (props) => props.fontFamily,
        fontSize: (props) => `${props.fontSize}em`
    }
})


//-----------------------------------------

const getReplaceAllRegex = (corrections) => {
    let retVal = '';
    corrections.forEach((c) => {
        retVal += `(${c.incorrectText.trim()})|`;
    });

    return new RegExp(`\\b${retVal.slice(0, -1)}\\b`, 'giu');
};
const correctPunctuations = (punctuationCorrections, text) => {
    text = text.replace(/  +/g, ' ');
    punctuationCorrections.forEach((c) => {
        text = text.replaceAll(c.completeWord ? `${c.incorrectText}\\b` : c.incorrectText, c.correctText);
    });
    return text;
};

const autoCorrectText = (autoCorrections, text) => {
    const correctionRegex = getReplaceAllRegex(autoCorrections);
    return text.replaceAll(correctionRegex, (matched) => autoCorrections.find((o) => o.incorrectText === matched)?.correctText.trim());
};

const autoCorrectNode = (node, corrections) => {
    if (node.getChildren) {
        node.getChildren().map((child) => {
            autoCorrectNode(child, corrections);
        });
    }

    if (node.getType() === 'text') {
        node.setTextContent(autoCorrectText(corrections, node.getTextContent()));
    }

    return node
}

const punctuationCorrectionNode = (node, corrections) => {
    if (node.getChildren) {
        node.getChildren().map((child) => {
            punctuationCorrectionNode(child, corrections);
        });
    }

    if (node.getType() === 'text') {
        node.setTextContent(correctPunctuations(corrections, node.getTextContent()));
    }

    return node
}

//-----------------------------------------

const TextEditor = ({ value, language, onSave, onChange, showSave = true, contentKey = null }) => {
    const { t } = useTranslation();
    const { getUnsavedChanges, saveUnsavedChanges, hasUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges(contentKey);
    const ref = React.useRef(null)

    const [fonts, setFonts] = useState([]);
    const [font, setFont] = useLocalStorage('editor.font', '');
    const [zoom, setZoom] = useLocalStorage('editor.zoom', 1);
    const classes = useStyles({ fontFamily: font, fontSize: zoom });

    useEffect(() => {
        var fts = getFonts(t, language);
        setFonts(fts);
    }, [language, t]);

    const {
        data: punctuationList,
        error: punctuationListError,
        isFetching: punctuationListLoading,
    } = useGetPunctuationQuery(
        { language }
    );

    const {
        data: autoCorrectList,
        error: autoCorrectListError,
        isFetching: autoCorrectListLoading,
    } = useGetAutoCorrectQuery(
        { language }
    );


    const autoCorrect = () => {
        var corrections = autoCorrectList;
        editor.update(() => {
            var root = $getRoot(editor);
            var children = root.getChildren();
            children.forEach((child) => {
                autoCorrectNode(child, corrections);
            });
        });
    }

    const punctuationCorrection = () => {
        var corrections = punctuationList;
        editor.update(() => {
            var root = $getRoot(editor);
            var children = root.getChildren();
            children.forEach((child) => {
                punctuationCorrectionNode(child, corrections);
            });
        });
    }
    useEffect(() => {
        ref.current?.setMarkdown(value ?? '')
    }, [value]);


    const canZoomIn = useMemo(() => zoom < MAX_ZOOM, [zoom]);
    const canZoomOut = useMemo(() => zoom > MIN_ZOOM, [zoom]);

    const zoomIn = () => {
        if (canZoomIn) {
            setZoom(z => z + ZOOM_STEP);
        }
    }

    const zoomOut = () => {
        if (canZoomOut) {
            setZoom(z => z - ZOOM_STEP);
        }
    }

    const imageUploadHandler = () => {

    }

    if (autoCorrectListLoading || punctuationListLoading) {
        return (<Loading />);
    }

    if (punctuationListError || autoCorrectListError) {
        return (<Error />)
    }

    const onChangeInternal = (markdown) => {
        saveUnsavedChanges(markdown);
        if (onChange) {
            onChange(markdown);
        }
    }

    const onApplyUnsavedChanges = () => {
        if (hasUnsavedChanges()) {
            ref.current?.setMarkdown(getUnsavedChanges());
        }

        clearUnsavedChanges();
    }

    const onClearUnsavedChanges = () => {
        clearUnsavedChanges()
    }

    const toolbarAlign = language == 'ur' ? 'end' : 'start'
    return (
        <Space direction='vertical'>
            {hasUnsavedChanges() && <Alert message={t("chapter.editor.unsavedContents")} type="info" closable action={
                <Space>
                    <Button size="small" type="ghost" onClick={onApplyUnsavedChanges}>
                        {t('actions.yes')}
                    </Button>
                    <Button size="small" type="ghost" onClick={onClearUnsavedChanges}>
                        {t('actions.no')}
                    </Button>

                </Space>
            } />}
            <MDXEditor ref={ref}
                onChange={onChangeInternal} markdown=''
                onError={e => console.log(e)}
                translation={(key, defaultValue, interpolations) => { return t(`editor.${key}`, defaultValue, interpolations) }}
                contentEditableClassName={classes.contentEditable}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    imagePlugin({ imageUploadHandler }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <Space direction='vertical' align={toolbarAlign}>
                                {showSave && <Space align={toolbarAlign}>
                                    <ButtonWithTooltip
                                        aria-label={t('toolbar.save', 'Save')}
                                        title={t('actions.save')}
                                        onClick={(_) => {
                                            onSave(ref.current?.getMarkdown())
                                                .then(() => clearUnsavedChanges());
                                        }} >
                                        <FaSave size={20} />
                                    </ButtonWithTooltip>
                                    <Separator />
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <Separator />
                                    <BlockTypeSelect />
                                    <InsertImage />
                                    <InsertThematicBreak />
                                    <ListsToggle />
                                </Space>}
                                <Space align={toolbarAlign}>
                                    <ButtonWithTooltip
                                        aria-label={t('toolbar.zoomin', 'Zoon In')}
                                        title={t('actions.zoonIn')}
                                        onClick={zoomIn} >
                                        <MdOutlineZoomIn size={20} />
                                    </ButtonWithTooltip>
                                    <ButtonWithTooltip
                                        aria-label={t('toolbar.zoomout', 'Zoon Out')}
                                        title={t('actions.zoonOut')}
                                        onClick={zoomOut} >
                                        <MdOutlineZoomOut size={20} />
                                    </ButtonWithTooltip>
                                    <Separator />
                                    <Select
                                        value={font}
                                        onChange={(newFont) => {
                                            setFont(newFont)
                                        }}
                                        triggerTitle={t('toolbar.blockTypeSelect.selectBlockTypeTooltip', 'Select display font')}
                                        placeholder={t('toolbar.blockTypeSelect.placeholder', 'Display Font')}
                                        items={fonts}
                                    />
                                </Space>
                            </Space>
                        )
                    })
                ]}
            />
        </Space>
    );
}

export default TextEditor;
