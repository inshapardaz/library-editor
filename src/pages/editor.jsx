import React from 'react';
import TextEditor from '../components/textEditor';
import ContentsContainer from '../components/layout/contentContainer';

const EditorPage = () => {
    return (
        <ContentsContainer>
            <TextEditor value="" language="ur" showSave={false} />
        </ContentsContainer>
    );
};

export default EditorPage;
