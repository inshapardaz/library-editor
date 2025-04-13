import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Checkbox, Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconWriting, IconEdit, IconReaderText, IconWriter, IconReviewer } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import If from '@/components/if';
import Img from '@/components/img';
import WritingDeleteButton from './writingDeleteButton';
import WritingAssignButton from './writingAssignButton';
import IconText from '@/components/iconText';
import WritingEditForm from './writingEditForm';
import EditingStatusIcon from '@/components/editingStatusIcon';
//-------------------------------------
const WritingListItem = ({ libraryId, writing, t, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();

    const icon = <IconWriting width={150} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={writing.id} justify='space-between'>
                <Group gap="sm" wrap="nowrap" >
                    <Img w={150} radius="sm" src={writing?.links?.image} fallback={icon} />
                    <Stack>
                        <Group>
                            <Checkbox checked={isSelected}
                                onChange={e => onSelectChanged(e.currentTarget.checked)} />
                            <Text component={Link} to={`/libraries/${libraryId}/writings/${writing.id}/contents/edit`} truncate="end" fw={500}>{writing.title}</Text>
                            <FavoriteButton article={writing} readonly />
                        </Group>
                        <AuthorsAvatar libraryId={libraryId} authors={writing?.authors} />
                        <Group>
                            <EditingStatusIcon editingStatus={writing.status} width={16} style={{ color: theme.colors.dark[2] }} />
                            <Text c="dimmed" size="sm">
                                {t(`editingStatus.${writing.status}`)}
                            </Text>
                            <If condition={writing.writerAccountId}>
                                <>
                                    <Divider orientation='vertical' />
                                    <IconText text={writing.writerAccountName} size="sm"
                                        icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                                </>
                            </If>
                            <If condition={writing.reviewerAccountId}>
                                <>
                                    <Divider orientation='vertical' />
                                    <IconText text={writing.reviewerAccountName} size="sm"
                                        icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                                </>
                            </If>
                        </Group>
                    </Stack>
                </Group>
                <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'end' }}>
                    <IconText
                        icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                        tooltip={t('writing.actions.read.title')}
                        link={`/libraries/${libraryId}/writings/${writing.id}/`} />
                    <If condition={writing.links.update}>
                        <Divider orientation="vertical" />
                        <WritingAssignButton t={t} libraryId={libraryId}
                            articles={[writing]} type="transparent" />
                    </If>
                    <If condition={writing.links.update}>
                        <Divider orientation="vertical" />
                        <WritingEditForm libraryId={libraryId} article={writing} >
                            <IconText
                                tooltip={t('actions.edit')}
                                icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
                        </WritingEditForm>
                    </If>
                    <If condition={writing.links.update && writing.links.delete != null}>
                        <Divider orientation="vertical" />
                    </If>
                    <If condition={writing.links.delete != null}>
                        <WritingDeleteButton libraryId={libraryId} writing={writing} t={t} />
                    </If>
                </Group>
            </Group>
            <Divider />
        </>)
}

WritingListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    writing: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        type: PropTypes.string,
        isPublic: PropTypes.bool,
        authors: PropTypes.array,
        categories: PropTypes.array,
        status: PropTypes.string,
        writerAccountId: PropTypes.number,
        writerAccountName: PropTypes.string,
        reviewerAccountId: PropTypes.number,
        reviewerAccountName: PropTypes.string,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string
        })
    })
}

export default WritingListItem;