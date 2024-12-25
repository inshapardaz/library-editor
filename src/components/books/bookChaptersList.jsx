import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// UI library imports
import {
    Center,
    Divider,
    Group,
    Loader,
    LoadingOverlay,
    Skeleton,
    Space,
    Stack,
    Text,
    Title,
    rem,
    useMantineTheme
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import cx from 'clsx';

// Local imports
import { useGetBookChaptersQuery, useUpdateChapterSequenceMutation } from '@/store/slices/books.api';
import { IconEdit, IconDelete, IconReaderText, IconGripVertical } from '@/components/icon';
import IconText from '@/components/iconText';
import Error from '@/components/error';
import If from '@/components/if';
import classes from './bookChaptersList.module.css';
//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const BookChaptersList = ({ libraryId, book, isLoading }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const {
        data: chapters,
        error: errorLoadingChapters,
        isFetching: loadingChapters,
        refetch
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book?.id
    }, { skip: isLoading === false || !libraryId || book === null || book?.id === null });

    const [updateChapterSequence, { isLoading: isUpdatingSequence }] =
        useUpdateChapterSequenceMutation();

    if (isLoading === true || loadingChapters) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (errorLoadingChapters) {
        return (<Error title={t('book.error.loading.title')}
            detail={t('book.error.loading.detail')}
            onRetry={refetch} />)
    }


    const onOrderChanged = ({ destination, source }) => {
        const fromIndex = source.index;
        const toIndex = destination.index;
        let payload = [...chapters.data];
        if (fromIndex !== toIndex) {
            const element = payload[fromIndex];
            payload.splice(fromIndex, 1);
            payload.splice(toIndex, 0, element);

            payload = payload.map((item, index) => ({
                id: item.id,
                chapterNumber: index + 1,
            }));

            return updateChapterSequence({ libraryId, bookId: book.id, payload })
                .unwrap()
                .then(() =>
                    notifications.show({
                        color: 'green',
                        title: t("chapter.actions.reorder.success")
                    })
                )
                .catch(() =>
                    notifications.show({
                        color: 'red',
                        title: t("chapter.actions.reorder.error")
                    })
                );
        }
    }

    if (!chapters || !chapters.data || chapters.data.length < 1) {
        return (<Center h={100}><Text>{t('book.chapterCount', { count: 0 })}</Text></Center>);
    }

    const items = chapters.data.map((chapter, index) => (
        <Draggable key={chapter.id} index={index} draggableId={`${chapter.id}`}>
            {(provided, snapshot) => (
                <div
                    className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        <IconGripVertical size={18} stroke={1.5} />
                    </div>
                    <Text className={classes.symbol}>{chapter.chapterNumber}</Text>
                    <Group mt="md" className={classes.details}>
                        <div>
                            <Text component={Link} to={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}/contents/edit`}>
                                {chapter.title}
                            </Text>
                            <Text c="dimmed" size="sm">
                                {t(`editingStatus.${chapter.status}`)}
                            </Text>
                        </div>
                        <span style={{ flex: 1 }}></span>
                        <If condition={chapter.links.update} >
                            <IconText
                                icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('issueArticle.actions.read.title')}
                                link={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}`}
                            />
                        </If>
                        <If condition={chapter.links.update} >
                            <Divider orientation='vertical' />
                            <IconText
                                icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('actions.edit')}
                                link={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}/edit`}
                            />
                        </If>
                        <If condition={chapter.links.delete} >
                            <Divider orientation='vertical' />
                            <IconText
                                icon={<IconDelete height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('actions.delete')}
                                link={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}/edit`}
                            />
                        </If>
                    </Group>
                </div>
            )}
        </Draggable>
    ));

    return (<Stack>
        <Title order={3}>{t('book.chapters')}</Title>
        <Space h="md" />
        <LoadingOverlay visible={isUpdatingSequence} loaderProps={{ children: <Center h={100}><Loader size={30} /></Center> }} />
        <DragDropContext onDragEnd={onOrderChanged}>
            <Droppable droppableId="book-chapters-dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </Stack>
    );
}

BookChaptersList.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        links: PropTypes.shape({
            image: PropTypes.string,
        }),
        publisher: PropTypes.string,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
    }),
    isLoading: PropTypes.object
};

export default BookChaptersList;