import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconWriting, IconEdit } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import If from '@/components/if';
import Img from '@/components/img';
import WritingDeleteButton from './writingDeleteButton';
import IconText from '@/components/iconText';
//-------------------------------------
const WritingListItem = ({ libraryId, writing, t }) => {
    const theme = useMantineTheme();

    const icon = <IconWriting width={150} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={writing.id} justify='space-between'>
                <Group gap="sm" wrap="nowrap" >
                    <Img w={150} radius="sm" src={writing?.links?.image} fallback={icon} />
                    <Stack>
                        <Group justify="space-between">
                            <Text component={Link} to={`/libraries/${libraryId}/writings/${writing.id}`} truncate="end" fw={500}>{writing.title}</Text>
                            <FavoriteButton article={writing} readonly />
                        </Group>
                        <AuthorsAvatar libraryId={libraryId} authors={writing?.authors} />
                    </Stack>
                </Group>
                <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'end' }}>
                    <If condition={writing.links.update}>
                        <IconText
                            tooltip={t('actions.edit')}
                            link={`/libraries/${libraryId}/writings/${writing.id}/edit`}
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
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
    writing: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string
        })
    })
}

export default WritingListItem;