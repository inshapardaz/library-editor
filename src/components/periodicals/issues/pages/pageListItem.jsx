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
//import PageEditForm from './pageEditForm';
import PageDeleteButton from './pageDeleteButton';
import EditingStatusIcon from '@/components/editingStatusIcon';
import PageEditForm from './pageEditForm';

//---------------------------------------------
const PageListItem = ({ t, libraryId, issue, page, index, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();
    return (
        <Draggable key={page.sequenceNumber} index={index} draggableId={`${page.sequenceNumber}`}>
            {(provided, snapshot) => (
                <div
                    className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        <IconGripVertical size={18} stroke={1.5} />
                    </div>
                    <Checkbox className={classes.selection} checked={isSelected}
                        onChange={e => onSelectChanged(e.currentTarget.checked)} />
                    <EditingStatusIcon editingStatus={page.status} width={32} style={{ color: theme.colors.dark[2] }} />
                    <Text pr="md" className={classes.symbol} component={Link} to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}/contents/edit`}>
                        {page.sequenceNumber}
                    </Text>
                    <Group mt="md" className={classes.details}>
                        <Stack gap="sm">
                            <If condition={page.chapterTitle}>
                                <Text mx="sm" component={Link} to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}/contents/edit`}>{page.chapterTitle}</Text>
                            </If>
                            <Group>
                                <Text c="dimmed" size="sm">
                                    {t(`editingStatus.${page.status}`)}
                                </Text>
                                <If condition={page.writerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={page.writerAccountName} size="sm"
                                            icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                                <If condition={page.reviewerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={page.reviewerAccountName} size="sm"
                                            icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                            </Group>
                        </Stack>
                        <span style={{ flex: 1 }}></span>
                        <If condition={page.links.update}>
                            <IconText
                                icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('issueArticle.actions.read.title')}
                                link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}`} />
                        </If>
                        <If condition={page.links.update}>
                            <Divider orientation='vertical' />
                            <PageEditForm libraryId={libraryId}
                                issue={issue}
                                page={page}>
                                <IconText
                                    icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                    tooltip={t('actions.edit')} />
                            </PageEditForm>
                        </If>
                        <If condition={page.links.delete}>
                            <Divider orientation='vertical' />
                            <PageDeleteButton pages={[page]} t={t} type='default' />
                        </If>
                    </Group>
                </div>
            )
            }
        </Draggable >
    );
};

PageListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    issue: PropTypes.shape({
        id: PropTypes.number,
        periodicalId: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueNumber: PropTypes.number,
    }),
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    page: PropTypes.shape({
        sequenceNumber: PropTypes.number,
        status: PropTypes.string,
        description: PropTypes.string,
        writerAccountId: PropTypes.number,
        writerAccountName: PropTypes.string,
        reviewerAccountId: PropTypes.number,
        reviewerAccountName: PropTypes.string,
        chapterId: PropTypes.number,
        chapterTitle: PropTypes.string,
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
export default PageListItem;