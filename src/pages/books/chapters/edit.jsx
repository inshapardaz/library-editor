import { useParams } from "react-router-dom";

const EditChapter = ({ onChange, value }) =>   {
    const { libraryId, bookId, chapterNumber } = useParams();

    return 'Editor'
}

export default EditChapter;
