import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';


//-----------------------------------------
// import Editor from 'urdu-web-editor'
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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

// Local import

import { FaSave } from '/src/icons';
import { Space } from 'antd';
import i18n from '../lang';
// import {
//     useGetPunctuationQuery,
//     useGetAutoCorrectQuery
// } from "/src/store/slices/toolsSlice";

// import Loading from "/src/components/common/loader";
// import Error from './common/error';

// import { getFonts } from '/src/lang';
// import { useLocalStorage } from 'usehooks-ts';

//-----------------------------------------
// const MIN_ZOOM = 10;
// const MAX_ZOOM = 200;
// const ZOOM_STEP = 10;
//-----------------------------------------

const TextEditor = ({ value, /*language,*/ onSave, onChange, showSave = true }) => {
    const { t } = useTranslation();

    const ref = React.useRef(null)

    //const [fonts, setFonts] = useState([]);
    //const [font, setFont] = useLocalStorage('editor.font', '');
    //const [zoom, setZoom] = useLocalStorage('editor.zoom', 100);

    // useEffect(() => {
    //     var fts = getFonts(t, language);
    //     setFonts(fts);
    // }, [language, t]);

    // const {
    //     data: punctuationList,
    //     error: punctuationListError,
    //     isFetching: punctuationListLoading,
    // } = useGetPunctuationQuery(
    //     { language }
    // );

    // const {
    //     data: autoCorrectList,
    //     error: autoCorrectListError,
    //     isFetching: autoCorrectListLoading,
    // } = useGetAutoCorrectQuery(
    //     { language }
    // );

    // const editorConfiguration = {
    //     richText: true,
    //     language: language,
    //     toolbar: {
    //         fonts: fonts,
    //         showAlignment: false,
    //         showFontFormat: true,
    //         showInsert: true,
    //         showExtraFormat: false,
    //         showInsertLink: false,
    //         showBlockFormat: true,
    //         showSave: showSave,
    //     },
    //     spellchecker: {
    //         enabled: true,
    //         language: language,
    //         punctuationCorrections: () => punctuationList,
    //         autoCorrections: () => autoCorrectList,
    //         wordList: () => []
    //     },
    //     format: "markdown"
    // }


    useEffect(() => {
        if (value) {
            ref.current?.setMarkdown(value ?? '')
        }
    }, [value]);


    // const canZoomIn = useMemo(() => zoom < MAX_ZOOM, [zoom]);
    // const canZoomOut = useMemo(() => zoom > MIN_ZOOM, [zoom]);

    /*const zoomIn = () => {
        if (canZoomIn) {
            setZoom(z => z + ZOOM_STEP);
        }
    }

    const zoomOut = () => {
        if (canZoomOut) {
            setZoom(z => z - ZOOM_STEP);
        }
    }*/

    const imageUploadHandler = () => {

    }

    // if (autoCorrectListLoading || punctuationListLoading) {
    //     return (<Loading />);
    // }

    // if (punctuationListError || autoCorrectListError) {
    //     return (<Error />)
    // }

    return (
        <MDXEditor ref={ref}
            onChange={onChange} markdown=''
            onError={e => console.log(e)}
            translation={(key, defaultValue, interpolations) => { return t(`editor.${key}`, defaultValue, interpolations) }}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                imagePlugin({ imageUploadHandler }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <Space direction='vertical'>
                            {showSave && <Space>
                                <ButtonWithTooltip
                                    aria-label={t('toolbar.save', 'Save')}
                                    title={t('actions.save')}
                                    onClick={(_) => {
                                        onSave(ref.current?.getMarkdown());
                                    }} >
                                    <FaSave size={20} />
                                </ButtonWithTooltip>
                                {' '}
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                {' '}
                                <BlockTypeSelect />
                                <InsertImage />
                                <InsertThematicBreak />
                                <ListsToggle />
                            </Space>}
                            {/* <Space>
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
                                <Select
                                    value={font}
                                    onChange={(newFont) => {
                                        setFont(newFont)
                                    }}
                                    triggerTitle={t('toolbar.blockTypeSelect.selectBlockTypeTooltip', 'Select display font')}
                                    placeholder={t('toolbar.blockTypeSelect.placeholder', 'Display Font')}
                                    items={fonts}
                                />
                            </Space> */}
                        </Space>
                    )
                })
            ]}
        />
    );
}

export default TextEditor;
