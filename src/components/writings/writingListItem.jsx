import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconWriting } from '@/components/icons';
import FavoriteButton from './favoriteButton';
import Img from '@/components/img';
//-------------------------------------
const IMAGE_HEIGHT = 150;

const WritingListItem = ({ libraryId, writing }) => {
    const theme = useMantineTheme();

    const icon = <IconWriting width={IMAGE_HEIGHT} style={{ color: theme.colors.dark[1] }} />;

    return (
        <>
            <Group gap="sm" wrap="nowrap" key={writing.id}>
                <Img h={IMAGE_HEIGHT} radius="sm" src={writing?.links?.image} fallback={icon} />
                <Stack>
                    <Group justify="space-between">
                        <Text component={Link} to={`/libraries/${libraryId}/writings/${writing.id}`} truncate="end" fw={500}>{writing.title}</Text>
                        <FavoriteButton article={writing} readonly />
                    </Group>
                    <AuthorsAvatar libraryId={libraryId} authors={writing?.authors} />
                </Stack>
            </Group >
            <Divider />
        </>)
}

WritingListItem.propTypes = {
    libraryId: PropTypes.string,
    writing: PropTypes.shape({
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

export default WritingListItem;