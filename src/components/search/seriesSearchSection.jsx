import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef } from 'react';

// Ui Library Imports
import { Group, Center, Text } from '@mantine/core';
import { Spotlight, SpotlightActionsGroup } from '@mantine/spotlight';

// Local imports
import { IconSeries } from "@/components/icons";
import { useGetSeriesQuery } from '@/store/slices/series.api';
import Img from '@/components/img';

//-----------------------------
const SeriesSearchSection = ({ t, navigate, libraryId, query, pageSize = 3,
    onSearchStatusChange = () => { },
    onDataStatusChange = () => { } }) => {
    const {
        data: series, isError: seriesError, isFetching: seriesLoading,
    } = useGetSeriesQuery(
        {
            libraryId,
            query,
            pageSize
        },
        {
            skip: query.length < 3,
            refetchOnReconnect: true,
            abortOnUnmount: true,
        }
    );

    const hasSeries = useMemo(() => !seriesError && !seriesLoading && series?.data?.length > 0, [seriesError, seriesLoading, series]);

    const icon = <IconSeries width={24} stroke={1.5} />;

    const prevSeriesLoading = useRef();
    const prevHasData = useRef();

    useEffect(() => {
        if (prevSeriesLoading.current !== seriesLoading) {
            onSearchStatusChange(seriesLoading);
            prevSeriesLoading.current = seriesLoading;
        }
        const hasData = !!series?.data?.length;
        if (prevHasData.current !== hasData) {
            onDataStatusChange(hasData);
            prevHasData.current = hasData;
        }
    }, [seriesLoading, series?.data, onSearchStatusChange, onDataStatusChange]);

    if (!hasSeries) {
        if (query.length < 3) {
            return (<Spotlight.Action key={t('header.series')}
                label={t('header.series')}
                description={t('series.description')}
                leftSection={icon}
                onClick={() => navigate(`/libraries/${libraryId}/series`)} />);
        }

        return null;
    }

    return (<SpotlightActionsGroup label={t('header.series')}>
        {series.data
            .map((serie) => <Spotlight.Action key={serie.id}
                onClick={() => navigate(`/libraries/${libraryId}/series/${serie.id}`)}>
                <Group wrap="nowrap" w="100%">
                    <Center>
                        <Img
                            src={serie.links.image}
                            h={50}
                            w={24}
                            alt={serie.title}
                            fit="contain"
                            fallback={icon} />
                    </Center>

                    <div style={{ flex: 1 }}>
                        <Text>{serie.title}</Text>

                        {serie.description && (
                            <Text opacity={0.6} size="xs" truncate="end">
                                {serie.description}
                            </Text>
                        )}
                    </div>
                </Group>
            </Spotlight.Action>)}
    </SpotlightActionsGroup>);
};

SeriesSearchSection.propTypes = {
    t: PropTypes.any.isRequired,
    navigate: PropTypes.any.isRequired,
    libraryId: PropTypes.string.isRequired,
    query: PropTypes.string,
    pageSize: PropTypes.number,
    onSearchStatusChange: PropTypes.func,
    onDataStatusChange: PropTypes.func,
};

export default SeriesSearchSection;
