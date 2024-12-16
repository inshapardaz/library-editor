import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";

// Ui library imports
import { Card, Grid, rem } from "@mantine/core";

// Local Import
import { SortDirection } from "@/models";
import BooksSideBar from "@/components/books/booksSidebar";
import BooksList from "@/components/books/booksList";
import PageHeader from "@/components/pageHeader";
import { IconNames } from '@/components/icon'
// -----------------------------------------
const BooksPage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const series = searchParams.get("series");
    const author = searchParams.get("author");
    const category = searchParams.get("category");
    const favorite = searchParams.get("favorite");
    const read = searchParams.get("read");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

    return (<>
        <PageHeader
            title={t('header.books')}
            defaultIcon={IconNames.Books}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home }
            ]} />
        <Grid type="container" breakpoints={{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }} mx="md">
            <Grid.Col span={{ md: 12, lg: 3, xl: 2 }} style={{ minWidth: rem(200) }}>
                <BooksSideBar
                    selectedCategory={category}
                    favorite={favorite}
                    read={read} />
            </Grid.Col>
            <Grid.Col span="auto">
                <Card withBorder>
                    <BooksList
                        libraryId={libraryId}
                        query={query}
                        author={author}
                        category={category}
                        series={series}
                        sortBy={sortBy}
                        favorite={favorite}
                        read={read}
                        sortDirection={sortDirection}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        showSearch
                        showTitle={false} />
                </Card>
            </Grid.Col>
        </Grid></>)
}

export default BooksPage;
