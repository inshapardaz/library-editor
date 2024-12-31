import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'clsx';

// UI library imports
import {
    Checkbox,
    Divider,
    Group,
    Stack,
    Text,
    useMantineTheme
} from '@mantine/core';
import { Draggable } from '@hello-pangea/dnd';

// Local imports
import { IconEdit, IconReaderText, IconGripVertical, IconWriter, IconReviewer } from '@/components/icons';
import classes from './items.module.css';
import IconText from '@/components/iconText';
import If from '@/components/if';
import ChapterEditForm from './chapterEditForm';
import ChapterDeleteButton from './chapterDeleteButton';
import EditingStatusIcon from '@/components/editingStatusIcon';

//---------------------------------------------
const BookChapterListItem = ({ t, libraryId, book, chapter, index, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();
    return (
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
                        checked={isSelected}
                        onChange={(e) => onSelectChanged(e.currentTarget.checked)} />
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
                        <If condition={chapter.links.update}>
                            <IconText
                                icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('issueArticle.actions.read.title')}
                                link={`/libraries/${libraryId}/books/${book.id}/chapters/${chapter.chapterNumber}`} />
                        </If>
                        <If condition={chapter.links.update}>
                            <Divider orientation='vertical' />
                            <ChapterEditForm libraryId={libraryId} bookId={book.id} chapter={chapter}>
                                <IconText
                                    icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                    tooltip={t('actions.edit')} />
                            </ChapterEditForm>
                        </If>
                        <If condition={chapter.links.delete}>
                            <Divider orientation='vertical' />
                            <ChapterDeleteButton chapters={[chapter]} t={t} type='default' />
                        </If>
                    </Group>
                </div>
            )}
        </Draggable>
    );
};


BookChapterListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    book: PropTypes.shape({
        id: PropTypes.number,
    }),
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    chapter: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        chapterNumber: PropTypes.number,
        status: PropTypes.string,
        description: PropTypes.string,
        writerAccountId: PropTypes.number,
        writerAccountName: PropTypes.string,
        reviewerAccountId: PropTypes.number,
        reviewerAccountName: PropTypes.string,
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
        }),
        publisher: PropTypes.string,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        pageCount: PropTypes.number,
        pageStatus: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.string,
            count: PropTypes.number,
            percentage: PropTypes.number
        })),
    }),
    isLoading: PropTypes.object,
    writerAssignmentFilter: PropTypes.string,
    reviewerAssignmentFilter: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    status: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
};

export default BookChapterListItem;