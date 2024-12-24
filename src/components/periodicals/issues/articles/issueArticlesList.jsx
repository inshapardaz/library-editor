import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui Library Imports
import { Center, Divider, Group, Loader, LoadingOverlay, rem, Skeleton, Space, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { notifications } from '@mantine/notifications';
import cx from 'clsx';

// Local imports
import { useGetIssueArticlesQuery, useUpdateIssueArticleSequenceMutation } from '@/store/slices/issueArticles.api';
import { IconEdit, IconDelete, IconReaderText, IconGripVertical } from '@/components/icon';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import IconText from '@/components/iconText';
import Error from '@/components/error';
import If from '@/components/if';
import classes from './issueArticlesList.module.css';
//------------------------------

const PRIMARY_COL_HEIGHT = rem(300);
//------------------------------

const IssueArticlesList = ({
    libraryId,
    periodicalId = null,
    volumeNumber = null,
    issueNumber = null
}) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

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

    if (isFetching) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (isError) {
        return (<Error title={t('issues.error.loading.title')}
            detail={t('issues.error.loading.detail')}
            onRetry={refetch} />)
    }


    if (!articles || !articles.data || articles.data.length < 1) {
        return (<Center h={100}><Text>{t('issue.articleCount', { count: 0 })}</Text></Center>);
    }

    const onOrderChanged = ({ destination, source }) => {
        console.log({ from: source.index, to: destination?.index || 0 })
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
                .then(() =>
                    notifications.show({
                        color: 'green',
                        title: t("issueArticles.actions.reorder.success")
                    })
                )
                .catch(() =>
                    notifications.show({
                        color: 'red',
                        title: t("issueArticles.actions.reorder.error")
                    })
                );
        }
    }

    const items = articles.data.map((article, index) => (
        <Draggable key={article.id} index={index} draggableId={`${article.id}`}>
            {(provided, snapshot) => (
                <div
                    className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        <IconGripVertical size={18} stroke={1.5} />
                    </div>
                    <Text className={classes.symbol}>{article.sequenceNumber}</Text>
                    <Group mt="md" className={classes.details}>
                        <div>
                            <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/contents/edit`}>
                                {article.title}
                            </Text>
                            <Text c="dimmed" size="sm">
                                {t(`editingStatus.${article.status}`)}
                            </Text>
                        </div>
                        <AuthorsAvatar libraryId={libraryId} authors={article?.authors} />
                        <span style={{ flex: 1 }}></span>
                        <If condition={article.links.update} >
                            <IconText
                                icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('issueArticle.actions.read.title')}
                                link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}`}
                            />
                        </If>
                        <If condition={article.links.update} >
                            <Divider orientation='vertical' />
                            <IconText
                                icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('actions.edit')}
                                link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
                            />
                        </If>
                        <If condition={article.links.delete} >
                            <Divider orientation='vertical' />
                            <IconText
                                icon={<IconDelete height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('actions.delete')}
                                link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
                            />
                        </If>
                    </Group>
                </div>
            )}
        </Draggable>
    ));

    return (<Stack>
        <Title order={3}>{t('issue.articles.title')}</Title>
        <Space h="md" />
        <LoadingOverlay visible={isUpdatingSequence} loaderProps={{ children: <Center h={100}><Loader size={30} /></Center> }} />
        <DragDropContext onDragEnd={onOrderChanged}>
            <Droppable droppableId="issue-article-dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </Stack>);
}

IssueArticlesList.propTypes = {
    libraryId: PropTypes.string,
    periodicalId: PropTypes.string,
    volumeNumber: PropTypes.string,
    issueNumber: PropTypes.string,
    showTitle: PropTypes.bool,
}

export default IssueArticlesList;