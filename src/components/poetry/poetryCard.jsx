import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Image } from '@mantine/core';

// Local imports
import { IconWriting } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import FavoriteButton from './favoriteButton';
import If from '@/components/if';
//---------------------------------------
const IMAGE_HEIGHT = 150;

const PoetryCard = ({ libraryId, poetry }) => {
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <Center h={IMAGE_HEIGHT + 50}><IconWriting height={IMAGE_HEIGHT} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" key={poetry.id} withBorder>
            <Card.Section>
                <If condition={poetry.links?.image && !imgError} elseChildren={icon}>
                    <Image h={IMAGE_HEIGHT} radius="sm" src={poetry?.links?.image} onError={() => setImgError(true)} />
                </If>
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/writings/${poetry.id}`} truncate="end" fw={500}>{poetry.title}</Text>
                <FavoriteButton poetry={poetry} readonly />
            </Group>

            <Group justify="space-between" mt="md" mb="xs">
                <AuthorsAvatar libraryId={libraryId} authors={poetry?.authors} />
            </Group>
        </Card>
    )
}

PoetryCard.propTypes = {
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
};

export default PoetryCard