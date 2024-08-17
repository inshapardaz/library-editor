import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Badge, Button, Checkbox, List, Space, Tooltip, Typography } from "antd";
import { Draggable } from "react-beautiful-dnd";

// Local Import
import { FaGripLines, FaRegFileAlt } from "/src/icons";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import useUnsavedChanges from '/src/hooks/useUnsavedChanges';
import AuthorAvatar from '/src/components/author/authorAvatar';
import IssueArticleEditor from "./issueArticleEditor";
import ArticleDeleteButton from "./issueArticleDeleteButton";
import IssueArticleAssignButton from "./issueArticleAssignButton";
import ArticleStatusButton from "./issueArticleStatusButton";

// ------------------------------------------------------
const AuthorsList = ({ libraryId, authors, t, showName = true }) => {
    if (!authors) return null;
    return (
        <Avatar.Group maxCount="2" size="large">
            {authors.map((author) => (
                <AuthorAvatar
                    key={author.id}
                    libraryId={libraryId}
                    author={author}
                    showName={showName}
                    t={t} />
            ))}
        </Avatar.Group>
    );
};
// ------------------------------------------------------

const IssueArticleListItem = ({
    libraryId,
    periodicalId,
    volumeNumber,
    issueNumber,
    article,
    selected = false,
    onSelectChanged = () => { },
    t,
}) => {
    const { hasUnsavedChanges } = useUnsavedChanges(`issue-article-${libraryId}-${periodicalId}-${volumeNumber}-${issueNumber}-${article.sequenceNumber}`);

    const unsavedStatus = () => {
        if (hasUnsavedChanges())
            return (<Badge status="processing" title={t('issueArticle.status.unsavedChanges')} />);

        return null;
    }

    const title = (<Link
        to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
    >
        <Typography.Text>
            {unsavedStatus()} {article.sequenceNumber} - {article.title}
        </Typography.Text>
    </Link>);


    return (
        <Draggable
            //isDragDisabled={!canEdit}
            draggableId={`article-${article?.id}-draggable`}
            index={article.sequenceNumber - 1}
        >
            {(provided) => (
                <List.Item
                    actions={[
                        article && article.links.assign && (
                            <IssueArticleAssignButton
                                libraryId={libraryId}
                                articles={[article]}
                                t={t}
                                type="text"
                                showIcon={false}
                            />
                        ),
                        article && article.links.update && (
                            <Tooltip title={t('issueArticle.actions.read.title')}>
                                <Button type="text">
                                    <Link
                                        to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}`}
                                    >
                                        <FaRegFileAlt />
                                    </Link>
                                </Button>
                            </Tooltip>
                        ),
                        article && article.links.update && (
                            <ArticleStatusButton
                                libraryId={libraryId}
                                articles={[article]}
                                t={t}
                                type="text"
                            />
                        ),
                        article && article.links.update && (
                            <IssueArticleEditor
                                libraryId={libraryId}
                                periodicalId={periodicalId}
                                volumeNumber={volumeNumber}
                                issueNumber={issueNumber}
                                article={article}
                                t={t}
                                type="text"
                            />
                        ),
                        article && article.links.delete && (
                            <ArticleDeleteButton
                                articles={[article]}
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
                        description={<AuthorsList
                            libraryId={libraryId}
                            authors={article?.authors}
                            showName={false}
                            t={t}
                        />}
                        avatar={
                            <Space>
                                <div {...provided.dragHandleProps}>
                                    <FaGripLines />
                                </div>
                                <Checkbox
                                    checked={selected}
                                    onChange={() => onSelectChanged(article)}
                                />
                                <Avatar size="small" icon={<EditingStatusIcon status={article.status} />} />
                            </Space>
                        }
                    />
                </List.Item>
            )}
        </Draggable>
    );
};

export default IssueArticleListItem;
