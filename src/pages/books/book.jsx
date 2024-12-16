import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import {
    Card,
    Center,
    Container,
    Divider,
    Grid,
    Group,
    Image,
    Skeleton,
    Space,
    Stack,
    rem,
    useMantineTheme
} from '@mantine/core';

// Local imports
import { useGetBookQuery } from '@/store/slices/books.api';
import BookChaptersList from '@/components/books/bookChaptersList';
import BookSeriesInfo from '@/components/series/bookSeriesInfo';
import FavoriteButton from '@/components/books/favoriteButton';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import CategoriesList from '@/components/categories/categoriesList';
import BookInfo from '@/components/books/bookInfo';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import If from '@/components/if';
import { IconNames, IconBook } from '@/components/icon';
//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const BookPage = () => {
    const { t } = useTranslation();
    const { libraryId, bookId } = useParams();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch
    } = useGetBookQuery({
        libraryId,
        bookId
    });

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;


    if (loadingBook) {
        return (<Container fluid mt="sm">
            <Grid
                mih={50}
            >
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
            </Grid>
        </Container>);
    }

    if (errorLoadingBook) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    }

    const icon = <Center h={450}><IconBook width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (<Container fluid mt="sm">
        <PageHeader title={book.title}
            subTitle={
                <Group visibleFrom='md'>
                    <AuthorsAvatar libraryId={libraryId} authors={book?.authors} showNames />
                    <If condition={book?.seriesName}>
                        <Divider orientation='vertical' />
                    </If>
                    <BookSeriesInfo libraryId={libraryId} book={book} />
                </Group>
            }
            details={book.description}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
            ]}
            actions={[
                (<FavoriteButton key="book-fav-button" book={book} size={24} />),
                (<CategoriesList key="book-categories-info" categories={book?.categories} size={24} showIcon={false} />)
            ]} />
        <Container size="responsive">
            <Grid
                mih={50}
            >
                <Grid.Col span="content">
                    <If condition={book.links?.image && !imgError} elseChildren={icon}>
                        <Image
                            src={book?.links?.image}
                            h={rem(400)}
                            w="auto"
                            radius="md"
                            alt={book?.title}
                            fit='contain'
                            onError={() => setImgError(true)}
                        />
                    </If>
                    <Stack hiddenFrom='md'>
                        <Space h="md" />
                        <AuthorsAvatar libraryId={libraryId} authors={book?.authors} showNames />
                        <BookSeriesInfo libraryId={libraryId} book={book} />
                    </Stack>
                    <Space h="md" />
                    <BookInfo libraryId={libraryId} book={book} isLoading={{ loadingBook }} />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Card withBorder>
                        <BookChaptersList libraryId={libraryId} book={book} isLoading={{ loadingBook }} />
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    </Container>);
}

BookPage.propTypes = {
    authors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }))
};

export default BookPage;
