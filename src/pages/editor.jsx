import TextEditor from '~/src/components/textEditor';
import ContentsContainer from '~/src/components/layout/contentContainer';

const EditorPage = () => {
    return (
        <ContentsContainer>
            <TextEditor value="" language="ur" showSave={false} />
        </ContentsContainer>
    );
};

export default EditorPage;
