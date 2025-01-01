import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import {
    Button,
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
    Tabs,
    rem,
    useMantineTheme
} from '@mantine/core';

// Local imports
import { useGetBookQuery } from '@/store/slices/books.api';
import BookChaptersList from '@/components/books/chapters/bookChaptersList';
import BookPagesList from '@/components/books/pages/bookPagesList';
import BookSeriesInfo from '@/components/series/bookSeriesInfo';
import FavoriteButton from '@/components/books/favoriteButton';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import CategoriesList from '@/components/categories/categoriesList';
import BookInfo from '@/components/books/bookInfo';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import If from '@/components/if';
import { IconBook, IconEditBook, IconPages, IconChapters, IconFiles } from '@/components/icons';
import IconNames from '@/components/iconNames'
import BookFilesList from '@/components/books/files/bookFilesList';
//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const BookPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { libraryId, bookId } = useParams();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section") ?? "chapters";
    const writerAssignmentFilter = searchParams.get("writerAssignmentFilter");
    const reviewerAssignmentFilter = searchParams.get("reviewerAssignmentFilter");
    const sortDirection = searchParams.get("sortDirection") ?? "ascending";
    const status = searchParams.get("status");
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

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

    const onChange = (key) => {
        navigate(`/libraries/${libraryId}/books/${book.id}/?section=${key}`);
    };

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
                (<CategoriesList key="book-categories-info" categories={book?.categories} size={24} showIcon={false} />),
                (<span key="book-spacer" style={{ flex: 1 }} />),
                (<Button key="book-edit" component={Link} to={`/libraries/${libraryId}/books/${book.id}/edit`} variant='default' leftSection={<IconEditBook />} >{t('actions.edit')}</Button>)
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
                        <Tabs value={section} onChange={onChange}>
                            <Tabs.List>
                                <Tabs.Tab value="chapters" leftSection={<IconChapters style={{ color: theme.colors.dark[3] }} />}>
                                    {t('book.chapters')}
                                </Tabs.Tab>
                                <Tabs.Tab value="pages" leftSection={<IconPages style={{ color: theme.colors.dark[3] }} />}>
                                    {t('book.pages')}
                                </Tabs.Tab>
                                <Tabs.Tab value="files" leftSection={<IconFiles style={{ color: theme.colors.dark[3] }} />}>
                                    {t('book.files.title')}
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="chapters">
                                <BookChaptersList libraryId={libraryId} book={book} isLoading={loadingBook} />
                            </Tabs.Panel>

                            <Tabs.Panel value="pages">
                                <BookPagesList libraryId={libraryId} book={book} isLoading={loadingBook}
                                    writerAssignmentFilter={writerAssignmentFilter}
                                    reviewerAssignmentFilter={reviewerAssignmentFilter}
                                    sortDirection={sortDirection}
                                    status={status}
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="files">
                                <BookFilesList libraryId={libraryId} book={book} isLoading={loadingBook} />
                            </Tabs.Panel>
                        </Tabs>
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
