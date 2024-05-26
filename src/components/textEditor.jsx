import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//-----------------------------------------
import Editor from 'urdu-web-editor'

// Local imports
import {
    useGetPunctuationQuery,
    useGetAutoCorrectQuery
} from "/src/store/slices/toolsSlice";

import Loading from "/src/components/common/loader";
import Error from './common/error';

import { getFonts } from '/src/lang';

//-----------------------------------------

const TextEditor = ({ value, language, onSave, onChange, showSave = true }) => {
    const { t } = useTranslation();

    const [fonts, setFonts] = useState([]);

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

    const editorConfiguration = {
        richText: true,
        language: language,
        toolbar: {
            fonts: fonts,
            showAlignment: false,
            showFontFormat: true,
            showInsert: true,
            showExtraFormat: false,
            showInsertLink: false,
            showBlockFormat: true,
            showSave: showSave,
        },
        spellchecker: {
            enabled: true,
            language: language,
            punctuationCorrections: () => punctuationList,
            autoCorrections: () => autoCorrectList,
            wordList: () => []
        },
        format: "markdown"
    }

    if (autoCorrectListLoading || punctuationListLoading) {
        return (<Loading />);
    }

    if (punctuationListError || autoCorrectListError) {
        return (<Error />)
    }

    return (<>
        <Editor configuration={editorConfiguration}
            value={value}
            onSave={onSave}
            onChange={onChange}
            style={{ flexGrow: 1 }}
        />
    </>);
}

export default TextEditor;
