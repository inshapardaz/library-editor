import PropTypes from 'prop-types';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import {
    Card,
    Container,
    useMantineTheme
} from '@mantine/core';

// Local imports
import { SortDirection } from "@/models";
import { useGetSeriesByIdQuery } from '@/store/slices/series.api';
import { IconBooks } from '@/components/icon';
import IconNames from '@/components/iconNames';
import BooksList from "@/components/books/booksList";
import IconText from "@/components/iconText";
import PageHeader, { PageHeaderSkeleton } from "@/components/pageHeader";
import If from "@/components/if";

//------------------------------------------------------

const SeriesPage = () => {
    const { libraryId, seriesId } = useParams();
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;
    const {
        data: series,
        error: errorLoadingSeries,
        isFetching: loadingSeries,
    } = useGetSeriesByIdQuery({
        libraryId,
        seriesId
    });

    if (loadingSeries) {
        return (<Container my="md">
            <PageHeaderSkeleton />
        </Container>);
    }

    if (errorLoadingSeries) {
        return "Error";
    }

    return (<Container fluid mt='md'>
        <PageHeader title={series.name}
            imageLink={series?.links?.image}
            defaultIcon={IconNames.Series}
            subTitle={
                <If condition={series.bookCount > 0}>
                    <IconText icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />} text={t('series.bookCount', { count: series.bookCount })} />
                </If>
            }
            details={series.description}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.series'), href: `/libraries/${libraryId}/series`, icon: IconNames.Series },
            ]} />

        <Card withBorder>
            <BooksList
                libraryId={libraryId}
                series={series?.id}
                query={query}
                sortBy="seriesIndex"
                sortDirection={sortDirection}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch
                showTitle={false} />
        </Card>
    </Container >);
}

SeriesPage.propTypes = {
    authors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }))
};

export default SeriesPage;
