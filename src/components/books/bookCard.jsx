import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library import
import { Card, Text, Group, Tooltip, useMantineTheme, Center, Divider } from '@mantine/core';

// Local imports
import { IconBook, IconPages, IconChapters, IconEditBook } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import FavoriteButton from '@/components/books/favoriteButton';
import BookDeleteButton from '@/components/books/bookDeleteButton';
import BookSeriesInfo from '@/components/series/bookSeriesInfo';
import IconText from '@/components/iconText';
import If from '@/components/if';
import Img from '@/components/img';
//---------------------------------------

const IMAGE_HEIGHT = 450;
const IMAGE_WIDTH = 150;

const BookCard = ({ libraryId, book }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const icon = <Center h={IMAGE_HEIGHT}><IconBook width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Img h={IMAGE_HEIGHT} fit='fit' radius="sm" src={book?.links?.image} fallback={icon} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/books/${book.id}`} truncate="end" fw={500}>{book.title}</Text>
                <FavoriteButton book={book} readonly />
            </Group>

            <Group justify="space-between" mt="md" mb="xs">
                <AuthorsAvatar libraryId={libraryId} authors={book?.authors} />
            </Group>
            <Group justify="space-between" mt="md" mb="xs">
                <If condition={book.seriesName}>
                    <BookSeriesInfo libraryId={libraryId} book={book} iconSize={16} />
                </If>
            </Group>

            <If condition={book?.description} elseChildren={<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                {t('book.noDescription')}
            </Text>}>
                <Tooltip label={book.description} withArrow>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                        {book.description}
                    </Text>
                </Tooltip>
            </If>
            <Group mt="md">
                <If condition={book.pageCount != null}>
                    <IconText
                        icon={<IconPages height={16} style={{ color: theme.colors.dark[2] }} />}
                        text={book.pageCount} />
                </If>
                <If condition={book.chapterCount != null}>
                    <>
                        <Divider orientation="vertical" />
                        <IconText
                            icon={<IconChapters height={16} style={{ color: theme.colors.dark[2] }} />}
                            text={book.chapterCount} />
                    </>
                </If>
                <If condition={book.links.update}>
                    <Divider orientation="vertical" />
                    <IconText
                        tooltip={t('actions.edit')}
                        link={`/libraries/${libraryId}/books/${book.id}/edit`}
                        icon={<IconEditBook height={16} style={{ color: theme.colors.dark[2] }} />} />
                </If>
                <If condition={book.links.delete != null}>
                    <>
                        <Divider orientation="vertical" />
                        <BookDeleteButton book={book} t={t} />
                    </>
                </If>
            </Group>
        </Card>
    )
}

BookCard.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        seriesName: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        })
    })
};

export default BookCard