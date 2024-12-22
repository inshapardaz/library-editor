import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import {
    Box,
    Card,
    Container,
    Grid,
    SimpleGrid,
    Skeleton,
    Tabs,
    rem,
    useMantineTheme
} from '@mantine/core';

// Local imports
import { SortDirection } from "@/models";
import { useGetAuthorQuery } from '@/store/slices/authors.api';
import { IconBooks, IconWritings, IconPoetries } from '@/components/icon';
import IconNames from '@/components/iconNames'
import { updateLinkToAuthorPage } from '@/utils';
import BooksList from "@/components/books/booksList";
import WritingsList from "@/components/writings/writingsList";
import PoetryList from "@/components/poetry/poetryList";
import Error from '@/components/error';
import PageHeader from "@/components/pageHeader";

//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);


const AuthorPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { libraryId, authorId } = useParams();
    const theme = useMantineTheme();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");
    const selectedTab = searchParams.get("tab") ?? "books";
    const {
        data: author,
        error: errorLoadingAuthor,
        isFetching: loadingAuthor,
        refetch
    } = useGetAuthorQuery({
        libraryId,
        authorId
    });

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    const onTabChanged = (value) => {
        navigate(updateLinkToAuthorPage(location, {
            tab: value,
            pageNumber: 1,
            query: ""
        }))
    };

    if (loadingAuthor) {
        return (<Container my="md">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                <Grid gutter="md">
                    <Grid.Col>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
        </Container>);
    }

    if (errorLoadingAuthor) {
        return (<Container my="md">
            <Error title={t('authors.error.loading.title')}
                detail={t('authors.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    }

    return (<Container fluid mt='md'>
        <PageHeader title={author.name}
            imageLink={author?.links?.image}
            defaultIcon={IconNames.Author}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.authors'), href: `/libraries/${libraryId}/authors`, icon: IconNames.Author },
            ]}
            details={author.description} />

        <Card withBorder>
            <Tabs keepMounted={false} value={selectedTab} onChange={onTabChanged}>
                <Tabs.List>
                    <Tabs.Tab value="books" leftSection={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />}>
                        {t('author.booksTabLabel', { count: author.bookCount })}
                    </Tabs.Tab>
                    <Tabs.Tab value="writings" leftSection={<IconWritings height={16} style={{ color: theme.colors.dark[2] }} />}>
                        {t('author.writingsTabLabel', { count: author.articleCount })}
                    </Tabs.Tab>
                    <Tabs.Tab value="poetry" leftSection={<IconPoetries height={16} style={{ color: theme.colors.dark[2] }} />}>
                        {t('author.poetryTabLabel', { count: author.poetryCount })}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="books">
                    <Box mt="md">
                        <BooksList
                            libraryId={libraryId}
                            author={author?.id}
                            query={query}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            showSearch
                            showTitle={false} />
                    </Box>
                </Tabs.Panel>
                <Tabs.Panel value="writings">
                    <Box mt="md">
                        <WritingsList
                            libraryId={libraryId}
                            author={author?.id}
                            query={query}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            showSearch
                            showTitle={false} />
                    </Box>
                </Tabs.Panel>
                <Tabs.Panel value="poetry">
                    <Box mt="md">
                        <PoetryList
                            libraryId={libraryId}
                            author={author?.id}
                            query={query}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            showSearch
                            showTitle={false} />
                    </Box>
                </Tabs.Panel>
            </Tabs>
        </Card>

    </Container >);
}

export default AuthorPage;
