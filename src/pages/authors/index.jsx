import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";

// Local Import
import { SortDirection } from "@/models";
import AuthorsList from "@/components/authors/authorsList";
import PageHeader from "@/components/pageHeader";
import { IconNames } from '@/components/icon'
import { Card } from "@mantine/core";

// -----------------------------------------
const AuthorsPage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const authorType = searchParams.get("authorType");
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

    return (<>
        <PageHeader
            title={t('header.authors')}
            defaultIcon={IconNames.Authors}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home }
            ]} />
        <Card withBorder mx="md">
            <AuthorsList
                libraryId={libraryId}
                query={query}
                authorType={authorType}
                sortBy={sortBy}
                sortDirection={sortDirection}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch />
        </Card>
    </>)
}

export default AuthorsPage;
