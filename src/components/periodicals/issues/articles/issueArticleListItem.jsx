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
import EditingStatusIcon from '@/components/editingStatusIcon';
import IssueArticleDeleteButton from './issueArticleDeleteButton';

//---------------------------------------------
const IssueArticleListItem = ({ t, libraryId, periodicalId, issue, article, index, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();
    return (
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
                    <Checkbox className={classes.selection}
                        checked={isSelected}
                        onChange={(e) => onSelectChanged(e.currentTarget.checked)} />
                    <EditingStatusIcon editingStatus={article.status} width={32} style={{ color: theme.colors.dark[2] }} />
                    <Text pr="md" className={classes.symbol}>{article.sequenceNumber}</Text>
                    <Group mt="md" className={classes.details}>
                        <Stack gap="sm">
                            <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${article.sequenceNumber}/contents/edit`}>
                                {article.title}
                            </Text>
                            <Group>
                                <Text c="dimmed" size="sm">
                                    {t(`editingStatus.${article.status}`)}
                                </Text>
                                <If condition={article.writerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={article.writerAccountName} size="sm"
                                            icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                                <If condition={article.reviewerAccountId}>
                                    <>
                                        <Divider orientation='vertical' />
                                        <IconText text={article.reviewerAccountName} size="sm"
                                            icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                                    </>
                                </If>
                            </Group>
                        </Stack>
                        <span style={{ flex: 1 }}></span>
                        <If condition={article.links.update} >
                            <IconText
                                icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('issueArticle.actions.read.title')}
                                link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${article.sequenceNumber}`}
                            />
                        </If>
                        <If condition={article.links.update} >
                            <Divider orientation='vertical' />
                            <IconText
                                icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                tooltip={t('actions.edit')}
                                link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${article.sequenceNumber}/edit`}
                            />
                        </If>
                        <If condition={article.links.delete} >
                            <Divider orientation='vertical' />
                            <IssueArticleDeleteButton t={t} issueArticle={article} />
                        </If>
                    </Group>
                </div>
            )}
        </Draggable>
    );
};


IssueArticleListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    periodicalId: PropTypes.any,
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    issue: PropTypes.shape({
        id: PropTypes.number,
        issueNumber: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueDate: PropTypes.string,
        periodicalId: PropTypes.number,
        periodicalName: PropTypes.string,
        pageCount: PropTypes.number,
        articleCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        })
    }),
    article: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        sequenceNumber: PropTypes.number,
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

export default IssueArticleListItem;