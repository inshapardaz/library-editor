import PropTypes from 'prop-types';

// Ui Library Import
import { Avatar, Group, Tooltip, useMantineTheme } from "@mantine/core";

// Local imports
import IconText from '@/components/iconText';
import { IconAuthor } from '@/components/icon';
//-------------------------------

const AuthorsAvatar = ({ libraryId, authors, size = "sm", showNames = false }) => {
    const theme = useMantineTheme();

    const icon = <IconAuthor height={200} style={{ color: theme.colors.dark[2] }} />;

    if (showNames) {
        return (<Group>
            {authors.map((author) => (
                <IconText key={author.id}
                    icon={<Avatar src={author?.links?.image || icon} />}
                    text={author.name}
                    size={size}
                    link={`/libraries/${libraryId}/authors/${author.id}`}
                />
            ))}
        </Group>);
    } else if (authors.length === 1) {
        return (authors.map((author) => (
            <IconText key={author.id}
                icon={<Avatar src={author?.links?.image || icon} />}
                text={author.name}
                size={size}
                link={`/libraries/${libraryId}/authors/${author.id}`}
            />)))
    } else {
        return (
            <Avatar.Group>
                {authors.map((author) => (
                    <Tooltip key={author.id} label={author.name} withArrow>
                        <Avatar src={author?.links?.image || icon} />
                    </Tooltip>
                ))
                }
            </Avatar.Group >)
    }
}


AuthorsAvatar.propTypes = {
    libraryId: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    })),
    size: PropTypes.string,
    showNames: PropTypes.bool,
};

export default AuthorsAvatar;