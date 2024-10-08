import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Badge, Checkbox, List, Space, Tag, Typography } from "antd";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import { FaRegKeyboard, FaGlasses, FaGripLines } from "/src/icons";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import useUnsavedChanges from '/src/hooks/useUnsavedChanges';
import PageSequenceEditor from "./pageSequenceEditor";
import PageDeleteButton from "./pageDeleteButton";
import PageAssignButton from "./pageAssignButton";
import PageStatusButton from "./pageStatusButton";
import PageChapterButton from './pageChapterButton';

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

    const { hasUnsavedChanges } = useUnsavedChanges(`page-${libraryId}-${book.id}-${page.sequenceNumber}`);


    const unsavedStatus = () => {
        if (hasUnsavedChanges())
            return (<Badge status="processing" title={t('chapter.status.unsavedChanges')} />);

        return null;
    }

    const title = (
        <Link
            to={`/libraries/${libraryId}/books/${book.id}/pages/${page.sequenceNumber}/edit`}
        >
            <Typography.Text>
                {unsavedStatus()}
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
                        page && page.links.update && (<PageChapterButton
                            libraryId={libraryId}
                            book={book}
                            pages={[page]}
                            t={t}
                            type="text"
                        />),
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
