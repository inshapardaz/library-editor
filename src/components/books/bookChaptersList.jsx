import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// UI library imports
import {
    Button,
    Center,
    Checkbox,
    Divider,
    Group,
    Loader,
    LoadingOverlay,
    Skeleton,
    Stack,
    Text,
    Tooltip,
    rem,
    useMantineTheme
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import cx from 'clsx';

// Local imports
import { useGetBookChaptersQuery, useUpdateChapterSequenceMutation } from '@/store/slices/books.api';
import { IconAdd, IconEdit, IconDelete, IconReaderText, IconGripVertical, IconWriter, IconReviewer } from '@/components/icons';
import IconText from '@/components/iconText';
import Error from '@/components/error';
import If from '@/components/if';
import classes from './bookChaptersList.module.css';
import ChapterEditForm from './chapterEditForm';
import ChapterDeleteButton from './chapterDeleteButton';
import ChapterAssignButton from './chapterAssignButton';
import ChapterStatusButton from './chapterStatusButton';
import EditingStatusIcon from '@/components/editingStatusIcon';
//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const BookChaptersList = ({ libraryId, book, isLoading }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [selection, setSelection] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);

    //--- Data operations -------------------------
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

    //--- Selection ------------------------------------
    const onSelectChanged = (selectedChapter, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedChapter.chapterNumber);
        } else {
            const currentIndex = selection.indexOf(selectedChapter.chapterNumber);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedChapters(
            chapters.data.filter((p) => newSelection.includes(p.chapterNumber))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedChapters([]);
    }

    const onSelectAll = () => {
        if (chapters.data.length > 0 && selection.length === chapters.data.length) {
            clearSelection();
        } else {
            setSelection(chapters.data.map((p) => p.chapterNumber));
            setSelectedChapters(chapters.data);
        }
    };

    const hasAllSelected = selection.length === chapters?.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < chapters?.data.length;
    //------------------------------------------------------

    //--- Rendering ----------------------------
    const items = chapters?.data?.map((chapter, index) => (
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
                    <Checkbox className={classes.selection}
                        checked={selection.indexOf(
                            chapter.chapterNumber
                        ) >= 0}
                        onChange={(e) => onSelectChanged(chapter, e.currentTarget.checked)} />
                    <EditingStatusIcon editingStatus={chapter.status} width={32} style={{ color: theme.colors.dark[2] }} />
                    <Text pr="md" className={classes.symbol}>{chapter.chapterNumber}</Text>
                    <Group mt="md" className={classes.details}>
                        <Stack gap="sm">
                            <Text component={Link} to={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}/contents/edit`}>
                                {chapter.title}
                            </Text>
                            <Group>
                                <Text c="dimmed" size="sm">
                                    {t(`editingStatus.${chapter.status}`)}
                                </Text>
                                <If condition={chapter.writerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={chapter.writerAccountName} size="sm"
                                            icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                                <If condition={chapter.reviewerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={chapter.reviewerAccountName} size="sm"
                                            icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                            </Group>
                        </Stack>
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
                            <ChapterEditForm libraryId={libraryId} bookId={book.id} chapter={chapter}>
                                <IconText
                                    icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                    tooltip={t('actions.edit')}
                                />
                            </ChapterEditForm>
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

    if (isLoading === true || loadingChapters) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (errorLoadingChapters) {
        return (<Error title={t('book.error.loading.title')}
            detail={t('book.error.loading.detail')}
            onRetry={refetch} />)
    }

    return (<Stack mt="md">
        <LoadingOverlay visible={isUpdatingSequence} loaderProps={{ children: <Center h={100}><Loader size={30} /></Center> }} />
        <Group>
            <Checkbox
                onChange={onSelectAll}
                checked={hasAllSelected}
                indeterminate={hasPartialSelection} />
            <Button.Group>
                <ChapterEditForm libraryId={libraryId} bookId={book.id} >
                    <Tooltip label={t('chapter.actions.add.label')}>
                        <Button variant='default'>
                            <IconAdd />
                        </Button>
                    </Tooltip>
                </ChapterEditForm>
                <ChapterDeleteButton chapters={selectedChapters} t={t} type='default' onDeleted={clearSelection} />
                <ChapterAssignButton libraryId={libraryId} chapters={selectedChapters} t={t} type='default' onCompleted={clearSelection} />
                <ChapterStatusButton chapters={selectedChapters} t={t} type='default' onCompleted={clearSelection} />
            </Button.Group>
        </Group>
        <If condition={chapters && chapters.data && chapters.data.length >= 1}
            elseChildren={<Center h={100}><Text>{t('book.chapterCount', { count: 0 })}</Text></Center>}>
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
        </If>
        <ChapterEditForm libraryId={libraryId} bookId={book.id} >
            <Button fullWidth
                variant='default'
                leftSection={<IconAdd />}>
                {t('chapter.actions.add.label')}
            </Button>
        </ChapterEditForm>
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