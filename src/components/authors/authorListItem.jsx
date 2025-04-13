import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// local imports
import { IconBooks, IconWritings, IconAuthor, IconPoetries, IconEdit } from '@/components/icons';
import IconText from '@/components/iconText';
import If from '@/components/if';
import Img from '@/components/img';
import AuthorDeleteButton from './authorDeleteButton';
//-------------------------------------

const IMAGE_HEIGHT = 150;
const AuthorListItem = ({ libraryId, author }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const icon = <IconAuthor height={IMAGE_HEIGHT} style={{ color: theme.colors.dark[2] }} />;
    return (<>
        <Group wrap="nowrap">
            <Img w={IMAGE_HEIGHT} radius="sm" src={author?.links?.image} fallback={icon} />
            <Stack>
                <Text component={Link} to={`/libraries/${libraryId}/authors/${author.id}`} truncate="end" fw={500}>{author.name}</Text>
                <Group mt="md">
                    <If condition={author.bookCount != null}>
                        <IconText link={`/libraries/${libraryId}/books?author=${author.id}`}
                            icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />}
                            text={t('author.bookCount', { count: author.bookCount })} />
                    </If>
                    <If condition={author.bookCount != null && author.articleCount != null}>
                        <Divider orientation="vertical" />
                    </If>
                    <If condition={author.articleCount != null}>
                        <IconText link={`/libraries/${libraryId}/writings?author=${author.id}`}
                            icon={<IconWritings height={16} style={{ color: theme.colors.dark[2] }} />}
                            text={t('author.articleCount', { count: author.articleCount })} />
                    </If>
                    <If condition={author.articleCount != null && author.poetryCount != null}>
                        <Divider orientation="vertical" />
                    </If>
                    <If condition={author.poetryCount != null}>
                        <IconText link={`/libraries/${libraryId}/poetry?author=${author.id}`}
                            icon={<IconPoetries height={16} style={{ color: theme.colors.dark[2] }} />}
                            text={t('author.poetryCount', { count: author.poetryCount })} />
                    </If>
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
            </Stack>
        </Group>
        <Divider />
    </>
    )
}

AuthorListItem.propTypes = {
    libraryId: PropTypes.string,
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        authorType: PropTypes.string,
        bookCount: PropTypes.number,
        articleCount: PropTypes.number,
        poetryCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default AuthorListItem;