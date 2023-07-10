import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Button, Checkbox, List, Space, Tag, Typography } from "antd";
import { FaRegKeyboard, FaGlasses, FaTrash, FaGripLines } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import PageStatusIcon from "./pageStatusIcon";

// ------------------------------------------------------

function PageListItem({ libraryId, bookId, page, selected = false, t }) {
    let description = page.chapterTitle ? (
        <Typography.Text>{page.chapterTitle}</Typography.Text>
    ) : null;

    const title = (
        <Link
            to={`/libraries/${libraryId}/books/${bookId}/pages/${page.sequenceNumber}/edit`}
        >
            <Typography.Text>
                {page.sequenceNumber}
                {description ? " - " : null}
                {description}
            </Typography.Text>
        </Link>
    );

    // const edit = <ChapterEditor libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} />;
    // const deleteBtn = <ChapterDeleteButton libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} onUpdated={onUpdated} />;
    // const assign = <ChapterAssignButton libraryId={libraryId} bookId={bookId} chapter={chapter} t={t} />;

    let assignment = null;

    if (page) {
        if (page.reviewerAccountId) {
            assignment = (
                <Tag icon={<FaRegKeyboard />} closable={false}>
                    {page.reviewerAccountName}
                </Tag>
            );
        } else if (page.writerAccountId) {
            assignment = (
                <Tag icon={<FaGlasses />} closable={false}>
                    {page.writerAccountName}
                </Tag>
            );
        }
    }

    return (
        <Draggable
            draggableId={`draggable-${page.id}`}
            index={page.sequenceNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[
                        <Button type="ghost">
                            <FaTrash />
                        </Button>,
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
                                <Checkbox />
                                <Avatar>
                                    <PageStatusIcon status={page.status} />
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

export default PageListItem;
