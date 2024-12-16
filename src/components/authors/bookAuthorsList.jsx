import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

// Ui Library Import
import { Avatar, Group, Stack, Text, useSafeMantineTheme } from "@mantine/core";

// Local imports
import { IconAuthor } from '@/components/icon';
//-----------------------------------------

const BookAuthorsList = ({ authors }) => {
    const { libraryId } = useParams();
    const theme = useSafeMantineTheme();

    const icon = <IconAuthor height={200} style={{ color: theme.colors.dark[2] }} />;
    return (
        <Stack>
            {authors.map((author) => (
                <Group key={author.id} component={Link} to={`/libraries/${libraryId}/authors/${author.id}`}>
                    <Avatar src={author?.links?.image || icon} />
                    <Text c="dimmed">{author.name}</Text>
                </Group>
            ))}
        </Stack>)
}


BookAuthorsList.propTypes = {
    authors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }))
};

export default BookAuthorsList;