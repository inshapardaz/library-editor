import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import cx from 'clsx';

// Ui Library Imports
import { Draggable } from "@hello-pangea/dnd";
import { Card, Center, Checkbox, Flex, Group, Text, useMantineTheme } from "@mantine/core";

// Local imports
import { IconEdit, IconReaderText, IconWriter, IconReviewer, IconGripVertical, IconImage } from '@/components/icons'
import IconText from '@/components/iconText';
import classes from './items.module.css';
import If from '@/components/if';
import Img from "@/components/img";
import EditingStatusIcon from '@/components/editingStatusIcon';
import PageDeleteButton from './pageDeleteButton';
import PageEditForm from './pageEditForm';

//-------------------------------------------
const IMAGE_HEIGHT = 450;
const IMAGE_WIDTH = 175;

const PageCard = ({ t, libraryId, issue, page, index, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();
    const icon = <Center h={IMAGE_HEIGHT}><IconImage width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;


    return (
        <Draggable key={page.sequenceNumber} index={index} draggableId={`${page.sequenceNumber}`}>
            {(provided, snapshot) => (
                <Card shadow="sm" padding="lg" radius="md" withBorder className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <Card.Section>
                        <Img h={IMAGE_HEIGHT} w="auto" radius="sm" src={page?.links?.image} fallback={icon} {...provided.dragHandleProps} className={classes.dragHandle} />
                    </Card.Section>

                    <Card.Section style={{ width: '100%' }}>
                        <Flex gap="sm" my="md">
                            <>
                                <div {...provided.dragHandleProps} className={classes.dragHandleCard}>
                                    <IconGripVertical size={18} stroke={1.5} />
                                </div>
                                <Checkbox className={classes.selectionCard} checked={isSelected}
                                    onChange={e => onSelectChanged(e.currentTarget.checked)} />
                                <EditingStatusIcon editingStatus={page.status} width={24} style={{ color: theme.colors.dark[2] }} />
                            </>
                            <Text component={Link} to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}/contents/edit`} fw={500}>
                                {page.sequenceNumber}
                            </Text>
                            <If condition={page.writerAccountId}>
                                <IconText tooltip={page.writerAccountName} size="sm"
                                    icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                            </If>
                            <If condition={page.reviewerAccountId}>
                                <IconText tooltip={page.reviewerAccountName} size="sm"
                                    icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                            </If>
                        </Flex>
                    </Card.Section>
                    <Card.Section>
                        <Group mb="md" justify='flex-start'>
                            <If condition={page.links.update}>
                                <IconText
                                    icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                                    tooltip={t('issueArticle.actions.read.title')}
                                    link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/${page.sequenceNumber}`} />
                            </If>
                            <If condition={page.links.update}>
                                <PageEditForm libraryId={libraryId}
                                    issue={issue}
                                    page={page}>
                                    <IconText
                                        icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                                        tooltip={t('actions.edit')} />
                                </PageEditForm>
                            </If>
                            <If condition={page.links.delete}>
                                <PageDeleteButton pages={[page]} t={t} type='subtle' />
                            </If>
                        </Group>
                    </Card.Section>
                </Card>)
            }
        </Draggable >
    )
};

PageCard.propTypes = {
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
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string,
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

export default PageCard;