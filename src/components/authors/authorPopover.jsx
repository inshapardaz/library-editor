import PropTypes from 'prop-types';

// UI Library Imprts
import { Paper, Image, Avatar, Text } from "@mantine/core";

// Local imports
import { IconAuthor, IconBooks, IconWritings } from '@/components/icons';
import IconText from '@/components/iconText';
import { forwardRef } from 'react';

//-----------------------------------------
const AuthorPopover = forwardRef(function AuthorPopover({ author }, ref) {
    return (<Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)" ref={ref}>
        {author.links?.image ?
            <Image h={225} radius="sm" src={author?.links?.image} /> :

            <Avatar
                size={120}
                radius={120}
                mx="auto"
            >
                <IconAuthor />
            </Avatar>}
        <Text ta="center" fz="lg" fw={500} mt="md">
            {author.name}
        </Text>
        <IconText icon={<IconBooks height={16} />} text={author.bookCount} />
        <IconText icon={<IconWritings height={16} />} text={author.articleCount} />
    </Paper>);
});

AuthorPopover.propTypes = {
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        bookCount: PropTypes.number,
        articleCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};
export default AuthorPopover;
