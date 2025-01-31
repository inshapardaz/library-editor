import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconPoetry, IconEdit, IconReaderText } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import PoetryDeleteButton from './poetryDeleteButton';
import Img from '@/components/img';
import IconText from '@/components/iconText';
import If from '@/components/if';
//-------------------------------------
const PoetryListItem = ({ libraryId, poetry, t }) => {
    const theme = useMantineTheme();

    const icon = <IconPoetry width={150} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={poetry.id} justify='space-between'>
                <Group gap="sm" wrap="nowrap" >
                    <Img w={150} radius="sm" src={poetry?.links?.image} fallback={icon} />
                    <Stack>
                        <Group justify="space-between">
                            <Text component={Link} to={`/libraries/${libraryId}/poetry/${poetry.id}/contents/edit`} truncate="end" fw={500}>{poetry.title}</Text>
                            <FavoriteButton poetry={poetry} readonly />
                        </Group>
                        <AuthorsAvatar libraryId={libraryId} authors={poetry?.authors} />
                    </Stack>
                </Group>
                <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'end' }}>
                    <IconText
                        icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                        tooltip={t('poetry.actions.read.title')}
                        link={`/libraries/${libraryId}/poetry/${poetry.id}/`} />
                    <If condition={poetry.links.update}>
                        <Divider orientation="vertical" />
                        <IconText
                            tooltip={t('actions.edit')}
                            link={`/libraries/${libraryId}/poetry/${poetry.id}/edit`}
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
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
    poetry: PropTypes.shape({
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

export default PoetryListItem;