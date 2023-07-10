import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List, Space, Tag, Typography } from "antd";
import { FaRegKeyboard, FaGlasses, FaGripLines } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import ChapterEditor from "./chapterEditor";
import ChapterDeleteButton from "./chapterDeleteButton";
import ChapterAssignButton from "./chapterAssignButton";

// ------------------------------------------------------

function ChapterListItem({ libraryId, bookId, chapter, selected = false, t, onUpdated = () => {} }) {
    const title = selected ? (
        <Typography.Text disabled={true}>{chapter.title}</Typography.Text>
    ) : (
        <Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}`}>
            <Typography.Text>{chapter.title}</Typography.Text>
        </Link>
    );

    const edit = <ChapterEditor libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} />;
    const deleteBtn = <ChapterDeleteButton libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} onUpdated={onUpdated} />;
    const assign = <ChapterAssignButton libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} />;

    let assignment = null;

    if (chapter) {
        if (chapter.reviewerAccountId) {
            assignment = (
                <Tag icon={<FaRegKeyboard />} closable={false}>
                    {chapter.reviewerAccountName}
                </Tag>
            );
        } else if (chapter.writerAccountId) {
            assignment = (
                <Tag icon={<FaGlasses />} closable={false}>
                    {chapter.writerAccountName}
                </Tag>
            );
        }
    }

    return (
        <Draggable
            //isDragDisabled={!canEdit}
            draggableId={`draggable-${chapter.id}`}
            index={chapter.chapterNumber - 1}
        >
            {(provided) => (
                <List.Item actions={[edit, deleteBtn, assign]} ref={provided.innerRef} {...provided.draggableProps}>
                    <List.Item.Meta
                        title={title}
                        avatar={
                            <Space {...provided.dragHandleProps}>
                                <FaGripLines />
                                <Avatar>{chapter.chapterNumber}</Avatar>
                            </Space>
                        }
                        description={assignment}
                    />
                </List.Item>
            )}
        </Draggable>
    );
}

export default ChapterListItem;
