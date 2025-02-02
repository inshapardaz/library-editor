import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui Library Imports
import { Button, Center, Checkbox, Group, Text, Tooltip } from '@mantine/core';

// Local imports
import { useGetIssueArticlesQuery, useUpdateIssueArticleSequenceMutation } from '@/store/slices/issueArticles.api';
import DataView from '@/components/dataView';
import { error, success } from '@/utils/notifications';
import IssueArticleListItem from './issueArticleListItem';
import { IconAdd } from '@/components/icons';
import IssueArticleAssignButton from './issueArticleAssignButton';
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


    if (!articles || !articles.data || articles.data.length < 1) {
        return (<Center h={100}><Text>{t('issue.articleCount', { count: 0 })}</Text></Center>);
    }

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

    // const items = articles.data.map((article, index) => (
    //     <Draggable key={article.id} index={index} draggableId={`${article.id}`}>
    //         {(provided, snapshot) => (
    //             <div
    //                 className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
    //                 ref={provided.innerRef}
    //                 {...provided.draggableProps}
    //             >
    //                 <div {...provided.dragHandleProps} className={classes.dragHandle}>
    //                     <IconGripVertical size={18} stroke={1.5} />
    //                 </div>
    //                 <Text className={classes.symbol}>{article.sequenceNumber}</Text>
    //                 <Group mt="md" className={classes.details}>
    //                     <div>
    //                         <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/contents/edit`}>
    //                             {article.title}
    //                         </Text>
    //                         <Text c="dimmed" size="sm">
    //                             {t(`editingStatus.${article.status}`)}
    //                         </Text>
    //                     </div>
    //                     <AuthorsAvatar libraryId={libraryId} authors={article?.authors} />
    //                     <span style={{ flex: 1 }}></span>
    //                     <If condition={article.links.update} >
    //                         <IconText
    //                             icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
    //                             tooltip={t('issueArticle.actions.read.title')}
    //                             link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}`}
    //                         />
    //                     </If>
    //                     <If condition={article.links.update} >
    //                         <Divider orientation='vertical' />
    //                         <IconText
    //                             icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
    //                             tooltip={t('actions.edit')}
    //                             link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
    //                         />
    //                     </If>
    //                     <If condition={article.links.delete} >
    //                         <Divider orientation='vertical' />
    //                         <IssueArticleDeleteButton t={t} issueArticle={article} />
    //                     </If>
    //                 </Group>
    //             </div>
    //         )}
    //     </Draggable>
    // ));

    return (<DataView
        emptyText={t('issue.articleCount', { count: 0 })}
        dataSource={articles}
        isFetching={Boolean(isFetching | isUpdatingSequence)}
        isError={isError}
        draggable
        droppableId="draggable-issue-articles"
        onOrderChanged={onOrderChanged}
        errorTitle={t('book.error.loading.title')}
        errorDetail={t('book.error.loading.detail')}
        showViewToggle={false}
        defaultViewType="list"
        viewToggleKey="book-chapter-list"
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
                    <Tooltip label={t('issueArticle.actions.add.label')}>
                        <Button key="issue-add-article" component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/add`} variant='default' ><IconAdd height={24} /></Button>
                    </Tooltip>
                    <IssueArticleAssignButton libraryId={libraryId} articles={selectedArticles} t={t} type='default' onCompleted={clearSelection} />
                    {/* 
                    <ChapterDeleteButton chapters={selectedChapters} t={t} type='default' onDeleted={clearSelection} />
                    <ChapterStatusButton chapters={selectedChapters} t={t} type='default' onCompleted={clearSelection} />*/}
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