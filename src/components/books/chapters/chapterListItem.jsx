import { Link } from "react-router-dom";


// 3rd Party Libraries
import { Avatar, Button, List, Typography } from "antd";
import { MdOutlineAssignmentInd } from 'react-icons/md';

// Local Import
import ChapterEditor from "./ChapterEditor";
import ChapterDelete from "./ChapterDelete";

// ------------------------------------------------------

function ChapterListItem({ libraryId, bookId, chapter, selected = false, t, onDeleted = () => { } }) {
    const title = selected ? (
        <Typography.Text disabled={true}>{chapter.title}</Typography.Text>
    ) : (
        <Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}`}>
            <Typography.Text>{chapter.title}</Typography.Text>
        </Link>
    );

    const edit = <ChapterEditor libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} />;
    const deleteBtn = <ChapterDelete libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} onDeleted={onDeleted} />;
    const assign = <Button type="text"><MdOutlineAssignmentInd /></Button>;
    return (
        <List.Item actions={[edit, deleteBtn, assign]}>
            <List.Item.Meta title={title} avatar={<Avatar>{chapter.chapterNumber}</Avatar>} />
        </List.Item>
    );
}

export default ChapterListItem;
