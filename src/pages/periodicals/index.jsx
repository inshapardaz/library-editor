import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";

// UI Library Import
import { Button, Card, Grid, rem } from "@mantine/core";

// Local Import
import { SortDirection } from "@/models";
import PeriodicalsSideBar from "@/components/periodicals/periodicalsSideBar";
import PeriodicalsList from "@/components/periodicals/periodicalsList";
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames'
import { IconAdd } from '@/components/icon'
// -----------------------------------------
const PeriodicalsPage = () => {
    const { t } = useTranslation();

    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const frequency = searchParams.get("frequency");
    const sortBy = searchParams.get("sortBy") ?? "title";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    return (<>
        <PageHeader
            title={t('header.periodicals')}
            defaultIcon={IconNames.Periodicals}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home }
            ]} actions={[
                (<Button key="periodical-edit" component={Link} to={`/libraries/${libraryId}/periodicals/add`} variant='default' leftSection={<IconAdd />} >{t('periodical.actions.add.label')}</Button>)
            ]} />
        <Grid type="container" breakpoints={{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }} mx="md">
            <Grid.Col span={{ md: 12, lg: 3, xl: 2 }} style={{ minWidth: rem(200) }}>
                <PeriodicalsSideBar
                    selectedCategory={category}
                    frequency={frequency} />
            </Grid.Col>
            <Grid.Col span="auto">
                <Card withBorder>
                    <PeriodicalsList
                        libraryId={libraryId}
                        query={query}
                        category={category}
                        sortBy={sortBy}
                        frequency={frequency}
                        sortDirection={sortDirection}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        showSearch
                        showTitle={false} />
                </Card>
            </Grid.Col>
        </Grid>
    </>)
}

export default PeriodicalsPage;
