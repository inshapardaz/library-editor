import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Badge, Checkbox, List, Space, Tag, Typography } from "antd";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import { FaRegKeyboard, FaGlasses, FaGripLines } from "/src/icons";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import useUnsavedChanges from '/src/hooks/useUnsavedChanges';
import IssuePageSequenceEditor from "./issuePageSequenceEditor";
import IssuePageDeleteButton from "./issuePageDeleteButton";
import IssuePageAssignButton from "./issuePageAssignButton";
import IssuePageStatusButton from "./issuePageStatusButton";
import IssuePageArticleButton from './issuePageArticleButton';

// ------------------------------------------------------

const IssuePageListItem = ({
    libraryId,
    issue,
    page,
    t,
    selected = false,
    onSelectChanged = () => { },
}) => {
    let description = page.chapterTitle ? (
        <Typography.Text>{page.chapterTitle}</Typography.Text>
    ) : null;

    const { hasUnsavedChanges } = useUnsavedChanges(`issue-page-${libraryId}-${issue.periodicalId}-${issue.volumeNumber}-${issue.issueNumber}-${page.sequenceNumber}`);

    const unsavedStatus = () => {
        if (hasUnsavedChanges())
            return (<Badge status="processing" title={t('chapter.status.unsavedChanges')} />);

        return null;
    }

    const title = (
        <Link
            to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}/edit`}
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
            draggableId={`issue-page-${page.sequenceNumber}-draggable`}
            index={page.sequenceNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[
                        page && page.links.update && (
                            <IssuePageSequenceEditor page={page} t={t} type="text" />
                        ),
                        page && page.links.update && (
                            <IssuePageStatusButton
                                pages={[page]}
                                t={t}
                                type="text"
                            />
                        ),
                        page && page.links.update && (<IssuePageArticleButton
                            libraryId={libraryId}
                            issue={issue}
                            pages={[page]}
                            t={t}
                            type="text"
                        />),
                        page && page.links.assign && (
                            <IssuePageAssignButton
                                libraryId={libraryId}
                                pages={[page]}
                                t={t}
                                type="text"
                            />
                        ),
                        page && page.links.delete && (
                            <IssuePageDeleteButton
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

export default IssuePageListItem;
