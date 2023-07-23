import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Button, Checkbox, List, Space, Tooltip, Typography } from "antd";
import {  FaGripLines, FaRegFileAlt } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import ChapterEditor from "./chapterEditor";
import ChapterDeleteButton from "./chapterDeleteButton";
import ChapterAssignButton from "./chapterAssignButton";
import EditingStatusIcon from "../../editingStatusIcon";
import ChapterStatusButton from "./chapterStatusButton";

// ------------------------------------------------------

function ChapterListItem({
    libraryId,
    bookId,
    chapter,
    selected = false,
    onSelectChanged = () => {},
    t,
}) {
    const title = (<Link
            to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}`}
        >
            <Typography.Text>
                {chapter.chapterNumber} - {chapter.title}
            </Typography.Text>
        </Link>);

    return (
        <Draggable
            //isDragDisabled={!canEdit}
            draggableId={`chapter-${chapter.id}-draggable`}
            index={chapter.chapterNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[
                        chapter && chapter.links.assign && (
                            <ChapterAssignButton
                            libraryId={libraryId}
                                chapters={[chapter]}
                                t={t}
                                type="text"
                                />
                        ),
                        chapter && chapter.links.update && (
                            <Tooltip title={t('chapter.editor.title')}>
                                <Button type="text">
                                    <Link
                                        to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}/edit`}
                                    >
                                        <FaRegFileAlt />
                                    </Link>
                                </Button>
                            </Tooltip>
                        ),
                        chapter && chapter.links.update && (
                            <ChapterStatusButton
                            libraryId={libraryId}
                            chapters={[chapter]}
                            t={t}
                            type="text"
                            />
                            ),
                        chapter && chapter.links.update && (
                            <ChapterEditor
                                libraryId={libraryId}
                                bookId={bookId}
                                chapter={chapter}
                                t={t}
                                type="text"
                            />
                        ),
                        chapter && chapter.links.delete && (
                            <ChapterDeleteButton
                                chapters={[chapter]}
                                t={t}
                                type="text"
                            />
                        ),
                    ]}
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
                </List.Item>
            )}
        </Draggable>
    );
}

export default ChapterListItem;
