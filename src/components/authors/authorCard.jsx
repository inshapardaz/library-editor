import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library import
import { Card, Text, Group, Divider, useMantineTheme, Center } from '@mantine/core';

// Local imports
import { IconBooks, IconWritings, IconAuthor, IconPoetries, IconEdit } from '@/components/icons';
import IconText from '../iconText';
import If from '@/components/if';
import Img from '@/components/img';
import AuthorDeleteButton from './authorDeleteButton';
//---------------------------------------

const AuthorCard = ({ libraryId, author }) => {
    const theme = useMantineTheme();
    const { t } = useTranslation();

    const icon = <Center h={225}><IconAuthor width={125} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Img h={225} radius="sm" src={author?.links?.image} fallback={icon} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/authors/${author.id}`} truncate="end" fw={500}>{author.name}</Text>
            </Group>

            <Group justify="space-between" mt="md" mb="xs">
                <IconText link={`/libraries/${libraryId}/books?author=${author.id}`}
                    icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />}
                    text={author.bookCount} />
                <Divider />
                <IconText link={`/libraries/${libraryId}/writings?author=${author.id}`}
                    icon={<IconWritings height={16} style={{ color: theme.colors.dark[2] }} />}
                    text={author.articleCount} />
                <Divider />
                <IconText
                    link={`/libraries/${libraryId}/poetry?author=${author.id}`}
                    icon={<IconPoetries height={16} style={{ color: theme.colors.dark[2] }} />}
                    text={author.poetryCount} />
            </Group>
            <Group justify="space-between" mt="md" mb="xs">
                <If condition={author.links.update} >
                    <Divider />
                    <IconText
                        icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                        tooltip={t('actions.edit')}
                        link={`/libraries/${libraryId}/authors/${author.id}/edit`}
                    />
                </If>
                <If condition={author.links.delete} >
                    <Divider orientation='vertical' />
                    <AuthorDeleteButton libraryId={libraryId} t={t} author={author} />
                </If>
            </Group>
        </Card>
    )
}

AuthorCard.propTypes = {
    libraryId: PropTypes.string,
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        bookCount: PropTypes.number,
        articleCount: PropTypes.number,
        poetryCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
};

export default AuthorCard