import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Checkbox, Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconPoetry, IconEdit, IconReaderText, IconWriter, IconReviewer } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import PoetryEditForm from './poetryEditForm';
import PoetryAssignButton from './poetryAssignButton';
import PoetryDeleteButton from './poetryDeleteButton';
import Img from '@/components/img';
import IconText from '@/components/iconText';
import If from '@/components/if';
import EditingStatusIcon from '@/components/editingStatusIcon';
//-------------------------------------
const PoetryListItem = ({ libraryId, poetry, t, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();

    const icon = <IconPoetry width={150} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={poetry.id} justify='space-between'>
                <Group gap="sm" wrap="nowrap" >
                    <Img w={150} radius="sm" src={poetry?.links?.image} fallback={icon} />
                    <Stack>
                        <Group>
                            <Checkbox checked={isSelected}
                                onChange={e => onSelectChanged(e.currentTarget.checked)} />
                            <Text component={Link} to={`/libraries/${libraryId}/poetry/${poetry.id}/contents/edit`} truncate="end" fw={500}>{poetry.title}</Text>
                            <FavoriteButton poetry={poetry} readonly />
                        </Group>
                        <AuthorsAvatar libraryId={libraryId} authors={poetry?.authors} />
                        <Group>
                            <EditingStatusIcon editingStatus={poetry.status} width={16} style={{ color: theme.colors.dark[2] }} />
                            <Text c="dimmed" size="sm">
                                {t(`editingStatus.${poetry.status}`)}
                            </Text>
                            <If condition={poetry.writerAccountId}>
                                <>
                                    <Divider orientation='vertical' />
                                    <IconText text={poetry.writerAccountName} size="sm"
                                        icon={<IconWriter style={{ color: theme.colors.dark[2] }} />} />
                                </>
                            </If>
                            <If condition={poetry.reviewerAccountId}>
                                <>
                                    <Divider orientation='vertical' />
                                    <IconText text={poetry.reviewerAccountName} size="sm"
                                        icon={<IconReviewer style={{ color: theme.colors.dark[2] }} />} />
                                </>
                            </If>
                        </Group>
                    </Stack>
                </Group>
                <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'end' }}>
                    <IconText
                        icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                        tooltip={t('poetry.actions.read.title')}
                        link={`/libraries/${libraryId}/poetry/${poetry.id}/`} />
                    <If condition={poetry.links.update}>
                        <>
                            <Divider orientation="vertical" />
                            <PoetryAssignButton t={t} libraryId={libraryId}
                                articles={[poetry]} type="transparent" />
                            <Divider orientation="vertical" />
                            <PoetryEditForm libraryId={libraryId} article={poetry} >
                                <IconText
                                    tooltip={t('actions.edit')}
                                    icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
                            </PoetryEditForm>
                        </>
                    </If>
                    <If condition={poetry.links.update && poetry.links.delete != null}>
                        <Divider orientation="vertical" />
                    </If>
                    <If condition={poetry.links.delete != null}>
                        <PoetryDeleteButton libraryId={libraryId} poetry={poetry} t={t} />
                    </If>
                </Group>
            </Group >
            <Divider />
        </>)
}

PoetryListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    poetry: PropTypes.shape({
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

export default PoetryListItem;