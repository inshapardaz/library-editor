import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Checkbox, List, Space, Tag, Typography } from "antd";
import { FaRegKeyboard, FaGlasses, FaGripLines } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import ChapterEditor from "./chapterEditor";
import ChapterDeleteButton from "./chapterDeleteButton";
import ChapterAssignButton from "./chapterAssignButton";
import EditingStatusIcon from "../../editingStatusIcon";

// ------------------------------------------------------

function ChapterListItem({
    libraryId,
    bookId,
    chapter,
    selected = false,
    onSelectChanged = () => {},
    t,
}) {
    const title = selected ? (
        <Typography.Text disabled={true}>{chapter.title}</Typography.Text>
    ) : (
        <Link
            to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}`}
        >
            <Typography.Text>
                {chapter.chapterNumber} - {chapter.title}
            </Typography.Text>
        </Link>
    );

    const edit = (
        <ChapterEditor
            libraryId={libraryId}
            bookId={bookId}
            chapter={chapter}
            t={t}
        />
    );
    const deleteBtn = <ChapterDeleteButton chapters={[chapter]} t={t} />;
    const assign = (
        <ChapterAssignButton libraryId={libraryId} chapters={[chapter]} t={t} />
    );

    let assignment = [];

    if (chapter) {
        if (chapter.reviewerAccountId) {
            assignment.push(
                <Tag icon={<FaRegKeyboard />} closable={false}>
                    {chapter.reviewerAccountName}
                </Tag>
            );
        }
        if (chapter.writerAccountId) {
            assignment.push(
                <Tag icon={<FaGlasses />} closable={false}>
                    {chapter.writerAccountName}
                </Tag>
            );
        }
    }

    return (
        <Draggable
            //isDragDisabled={!canEdit}
            draggableId={`chapter-${chapter.id}-draggable`}
            index={chapter.chapterNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[edit, deleteBtn, assign]}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <List.Item.Meta
                        title={title}
                        avatar={
                            <Space>
                                <div {...provided.dragHandleProps}>
                                    <FaGripLines />
                                </div>
                                <Checkbox
                                    checked={selected}
                                    onChange={() => onSelectChanged(chapter)}
                                />
                                <Avatar>
                                    <EditingStatusIcon
                                        status={chapter.status}
                                    />
                                </Avatar>
                            </Space>
                        }
                    />
                    {assignment}
                </List.Item>
            )}
        </Draggable>
    );
}

export default ChapterListItem;
