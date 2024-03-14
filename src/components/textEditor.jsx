import { useState } from 'react';
import Editor from 'urdu-web-editor'

//-----------------------------------------

// Local imports
import {
    useGetPunctuationQuery,
    useGetAutoCorrectQuery
} from "../features/api/toolsSlice";

import Loading from "../components/common/loader";
import Error from './common/error';

import { getFonts } from '../i18n';

//-----------------------------------------

const TextEditor = ({ value, language, onSave = (c) => {} }) => {

    const [fonts] = useState(getFonts(language));

    const {
        data: punctuationList,
        error: punctuationListError,
        isFetching : punctuationListLoading,
    } = useGetPunctuationQuery(
        { language }
    );

    const {
        data: autoCorrectList,
        error: autoCorrectListError,
        isFetching : autoCorrectListLoading,
    } = useGetAutoCorrectQuery(
        { language }
    );

    const editorConfiguration =   {
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
            showSave: true,
        },
        spellchecker: {
            enabled : true,
            language: language,
            punctuationCorrections: (lang) => punctuationList,
            autoCorrections: (lang) => autoCorrectList,
            wordList : (lang) => []
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
            value={ value }
            onSave={ c => onSave(c) }
            />
    </>);
}

export default TextEditor;
