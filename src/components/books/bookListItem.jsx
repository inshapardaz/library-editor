import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import { IconBook, IconPages, IconChapters, IconEditBook, IconFiles } from '@/components/icons';
import IconText from '@/components/iconText';
import FavoriteButton from '@/components/books/favoriteButton';
import BookDeleteButton from '@/components/books/bookDeleteButton';
import BookSeriesInfo from '@/components/series/bookSeriesInfo';
import If from '@/components/if';
import Img from '@/components/img';
//-------------------------------------

const BookListItem = ({ libraryId, book }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const icon = <IconBook width={150} style={{ color: theme.colors.dark[1] }} />;
    const fileCount = book?.contents?.length ?? 0;
    return (<>
        <Group gap="sm" wrap="nowrap">
            <Img w={150} radius="sm" src={book?.links?.image} fallback={icon} />
            <Stack>
                <Group justify="space-between">
                    <Text component={Link} to={`/libraries/${libraryId}/books/${book.id}`} truncate="end" fw={500}>{book.title}</Text>
                    <FavoriteButton book={book} readonly />
                </Group>
                {book?.description ?
                    (<Tooltip label={book.description} withArrow>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            {book.description}
                        </Text>
                    </Tooltip>) :
                    (<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                        {t('book.noDescription')}
                    </Text>)}
                <AuthorsAvatar libraryId={libraryId} authors={book?.authors} />
                <Group mt="md">
                    <If condition={book.seriesName}>
                        <BookSeriesInfo libraryId={libraryId} book={book} iconSize={16} />
                        <Divider orientation="vertical" />
                    </If>
                    <If condition={book.pageCount != null}>
                        <IconText size="sm" icon={<IconPages height={16} style={{ color: theme.colors.dark[2] }} />} text={t('book.pageCount', { count: book.pageCount })} />
                    </If>
                    <If condition={book.chapterCount != null}>
                        <>
                            <Divider orientation="vertical" />
                            <IconText size="sm" icon={<IconChapters height={16} style={{ color: theme.colors.dark[2] }} />} text={t('book.chapterCount', { count: book.chapterCount })} />
                        </>
                    </If>
                    <Divider orientation="vertical" />
                    <IconText size="sm" icon={<IconFiles height={16} style={{ color: theme.colors.dark[2] }} />} text={t('book.fileCount', { count: fileCount })} />
                    <If condition={book.links.update}>
                        <>
                            <Divider orientation="vertical" />
                            <IconText
                                tooltip={t('actions.edit')}
                                link={`/libraries/${libraryId}/books/${book.id}/edit`}
                                icon={<IconEditBook height={16} style={{ color: theme.colors.dark[2] }} />} />
                        </>
                    </If>
                    <If condition={book.links.delete != null}>
                        <>
                            <Divider orientation="vertical" />
                            <BookDeleteButton book={book} t={t} />
                        </>
                    </If>
                </Group>
            </Stack>
        </Group>
        <Divider />
    </>)
}

BookListItem.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        contents: PropTypes.array,
        seriesId: PropTypes.number,
        seriesName: PropTypes.string,
        seriesIndex: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        })
    })
}

export default BookListItem;