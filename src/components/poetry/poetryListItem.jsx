import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Divider, Group, Image, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconPoetry } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import If from '@/components/if';
//-------------------------------------
const IMAGE_HEIGHT = 150;

const PoetryListItem = ({ libraryId, poetry }) => {
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <IconPoetry width={IMAGE_HEIGHT} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={poetry.id}>
                <If condition={poetry.links?.image && !imgError} elseChildren={icon}>
                    <Image h={IMAGE_HEIGHT} radius="sm" src={poetry?.links?.image} onError={() => setImgError(true)} />
                </If>
                <Stack>
                    <Group justify="space-between">
                        <Text component={Link} to={`/libraries/${libraryId}/poetry/${poetry.id}`} truncate="end" fw={500}>{poetry.title}</Text>
                        <FavoriteButton poetry={poetry} readonly />
                    </Group>
                    <AuthorsAvatar libraryId={libraryId} authors={poetry?.authors} />
                </Stack>
            </Group >
            <Divider />
        </>)
}

PoetryListItem.propTypes = {
    libraryId: PropTypes.string,
    poetry: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
}

export default PoetryListItem;