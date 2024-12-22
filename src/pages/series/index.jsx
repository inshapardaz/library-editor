import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";

// UI Library Imports
import { Button, Card } from "@mantine/core";

// Local Import
import { SortDirection } from "@/models";
import SeriesList from "@/components/series/seriesList";
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd } from '@/components/icon';

// -----------------------------------------
const SeriesListPage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

    return (<>
        <PageHeader
            title={t('header.series')}
            defaultIcon={IconNames.Series}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home }
            ]} actions={[
                (<Button key="book-edit" component={Link} to={`/libraries/${libraryId}/series/add`} variant='default' leftSection={<IconAdd />} >{t('series.actions.add.label')}</Button>)
            ]} />
        <Card withBorder mx="md">
            <SeriesList
                libraryId={libraryId}
                query={query}
                sortBy={sortBy}
                sortDirection={sortDirection}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch />
        </Card>
    </>)
}

export default SeriesListPage;
