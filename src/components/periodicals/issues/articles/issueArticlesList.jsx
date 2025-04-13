import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

// Ui Library Imports
import { Button, Checkbox, Group, Tooltip } from '@mantine/core';

// Local imports
import { useGetIssueArticlesQuery, useUpdateIssueArticleSequenceMutation } from '@/store/slices/issueArticles.api';
import DataView from '@/components/dataView';
import { error, success } from '@/utils/notifications';
import IssueArticleListItem from './issueArticleListItem';
import { IconAdd } from '@/components/icons';
import IssueArticleAssignButton from './issueArticleAssignButton';
import IssueArticleEditForm from './issueArticleEditForm';
import IssueArticleStatusButton from './issueArticleStatusButton';
//------------------------------

const IssueArticlesList = ({
    libraryId,
    periodicalId = null,
    volumeNumber = null,
    issueNumber = null,
    issue
}) => {
    const { t } = useTranslation();

    const [selection, setSelection] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);

    const {
        refetch,
        data: articles,
        isError,
        isFetching,
    } = useGetIssueArticlesQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
    });

    const [updateIssueArticleSequence, { isLoading: isUpdatingSequence }] =
        useUpdateIssueArticleSequenceMutation();

    //--- Selection ------------------------------------
    const onSelectChanged = (selectedArticle, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedArticle.id);
        } else {
            const currentIndex = selection.indexOf(selectedArticle.id);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedArticles(
            articles.data.filter((p) => newSelection.includes(p.id))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedArticles([]);
    }

    const onSelectAll = () => {
        if (articles.data.length > 0 && selection.length === articles.data.length) {
            clearSelection();
        } else {
            setSelection(articles.data.map((p) => p.id));
            setSelectedArticles(articles.data);
        }
    };

    const hasAllSelected = selection.length === articles?.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < articles?.data.length;

    //------------------------------------------------------

    const onOrderChanged = ({ destination, source }) => {
        const fromIndex = source.index;
        const toIndex = destination.index;
        let payload = [...articles.data];
        if (fromIndex !== toIndex) {
            const element = payload[fromIndex];
            payload.splice(fromIndex, 1);
            payload.splice(toIndex, 0, element);

            payload = payload.map((item, index) => ({
                id: item.id,
                sequenceNumber: index + 1,
            }));

            return updateIssueArticleSequence({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload
            })
                .unwrap()
                .then(() => success({ message: t("issueArticles.actions.reorder.success") }))
                .catch(() => error({ message: t("issueArticles.actions.reorder.error") }));
        }
    }

    return (<DataView
        emptyText={t('issue.articleCount', { count: 0 })}
        dataSource={articles}
        isFetching={Boolean(isFetching | isUpdatingSequence)}
        isError={isError}
        draggable
        droppableId="draggable-issue-articles"
        onOrderChanged={onOrderChanged}
        errorTitle={t('issueArticles.error.loading.title')}
        errorDetail={t('issueArticles.error.loading.detail')}
        showViewToggle={false}
        defaultViewType="list"
        viewToggleKey="issue-articles-list"
        showPagination={false}
        onReload={refetch}
        listItemRender={(article, index) => <IssueArticleListItem t={t}
            libraryId={libraryId}
            periodicalId={periodicalId}
            issue={issue}
            article={article}
            key={article.id}
            index={index}
            isSelected={selection.indexOf(
                article.id
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(article, checked)} />}
        showSearch={false} article
        actions={
            <Group>
                <Checkbox
                    onChange={onSelectAll}
                    checked={hasAllSelected}
                    indeterminate={hasPartialSelection} />
                <Button.Group>
                    <IssueArticleEditForm libraryId={libraryId} issue={issue} >
                        <Tooltip label={t('issueArticle.actions.add.label')}>
                            <Button variant='default'>
                                <IconAdd />
                            </Button>
                        </Tooltip>
                    </IssueArticleEditForm>
                    <IssueArticleAssignButton libraryId={libraryId} articles={selectedArticles} t={t} type='default' onCompleted={clearSelection} />
                    {/* 
                    <ChapterDeleteButton chapters={selectedChapters} t={t} type='default' onDeleted={clearSelection} />
                    */}
                    <IssueArticleStatusButton articles={selectedArticles} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group >
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}

    />);
}

IssueArticlesList.propTypes = {
    libraryId: PropTypes.string,
    periodicalId: PropTypes.string,
    volumeNumber: PropTypes.string,
    issueNumber: PropTypes.string,
    showTitle: PropTypes.bool,
    issue: PropTypes.any,
}

export default IssueArticlesList;