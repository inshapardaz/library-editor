import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Checkbox, List, Space, Tag, Typography } from "antd";
import { FaRegKeyboard, FaGlasses, FaGripLines } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import EditingStatusIcon from "/src/components/editingStatusIcon";
import PageSequenceEditor from "./pageSequenceEditor";
import PageDeleteButton from "./pageDeleteButton";
import PageAssignButton from "./pageAssignButton";
import PageStatusButton from "./pageStatusButton";

// ------------------------------------------------------

const PageListItem = ({
    libraryId,
    book,
    page,
    t,
    selected = false,
    onSelectChanged = () => { },
}) => {
    let description = page.chapterTitle ? (
        <Typography.Text>{page.chapterTitle}</Typography.Text>
    ) : null;

    const title = (
        <Link
            to={`/libraries/${libraryId}/books/${book.id}/pages/${page.sequenceNumber}/edit`}
        >
            <Typography.Text>
                {page.sequenceNumber}
                {description ? " - " : null}
                {description}
            </Typography.Text>
        </Link>
    );

    let assignment = [];

    if (page) {
        if (page.reviewerAccountId) {
            assignment.push(
                <Tag icon={<FaRegKeyboard />} closable={false}>
                    {page.reviewerAccountName}
                </Tag>
            );
        }
        if (page.writerAccountId) {
            assignment.push(
                <Tag icon={<FaGlasses />} closable={false}>
                    {page.writerAccountName}
                </Tag>
            );
        }
    }

    return (
        <Draggable
            draggableId={`page-${page.sequenceNumber}-draggable`}
            index={page.sequenceNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[
                        page && page.links.update && (
                            <PageSequenceEditor page={page} t={t} type="text" />
                        ),
                        page && page.links.update && (
                            <PageStatusButton
                                pages={[page]}
                                t={t}
                                type="text"
                            />
                        ),
                        page && page.links.assign && (
                            <PageAssignButton
                                libraryId={libraryId}
                                pages={[page]}
                                t={t}
                                type="text"
                            />
                        ),
                        page && page.links.delete && (
                            <PageDeleteButton
                                pages={[page]}
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
                                    onChange={() => onSelectChanged(page)}
                                />
                                <Avatar>
                                    <EditingStatusIcon status={page.status} />
                                </Avatar>
                            </Space>
                        }
                    />
                    {assignment}
                </List.Item>
            )}
        </Draggable>
    );
};

export default PageListItem;
