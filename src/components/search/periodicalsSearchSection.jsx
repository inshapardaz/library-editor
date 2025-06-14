import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef } from 'react';

// Ui Library Imports
import { Group, Center, Text } from '@mantine/core';
import { Spotlight, SpotlightActionsGroup } from '@mantine/spotlight';

// Local imports
import { useGetPeriodicalsQuery } from '@/store/slices/periodicals.api';
import { IconPeriodicals } from "@/components/icons";
import Img from '@/components/img';

//-----------------------------
const PeriodicalsSearchSection = ({ t, navigate, libraryId, query, pageSize = 3,
    onSearchStatusChange = () => { },
    onDataStatusChange = () => { } }) => {
    const {
        data: periodicals, isError: periodicalsError, isFetching: periodicalsLoading,
    } = useGetPeriodicalsQuery(
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

    const hasPeriodicals = useMemo(() => !periodicalsLoading && !periodicalsError && periodicals?.data?.length > 0, [periodicalsLoading, periodicalsError, periodicals]);

    const icon = <IconPeriodicals width={24} stroke={1.5} />;

    const prevPeriodicalsLoading = useRef();
    const prevHasData = useRef();

    useEffect(() => {
        if (prevPeriodicalsLoading.current !== periodicalsLoading) {
            onSearchStatusChange(periodicalsLoading);
            prevPeriodicalsLoading.current = periodicalsLoading;
        }
        const hasData = !!periodicals?.data?.length;
        if (prevHasData.current !== hasData) {
            onDataStatusChange(hasData);
            prevHasData.current = hasData;
        }
    }, [periodicalsLoading, periodicals?.data, onSearchStatusChange, onDataStatusChange]);

    if (!hasPeriodicals) {
        if (query.length < 3) {
            return (<Spotlight.Action key={t('header.periodicals')}
                label={t('header.periodicals')}
                description={t('periodicals.description')}
                leftSection={icon}
                onClick={() => navigate(`/libraries/${libraryId}/periodicals`)} />);
        }

        return null;
    }

    return (<SpotlightActionsGroup label={t('header.periodicals')}>
        {periodicals.data
            .map((periodical) => <Spotlight.Action key={periodical.id}
                onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodical.id}`)}>
                <Group wrap="nowrap" w="100%">
                    <Center>
                        <Img
                            src={periodical.links.image}
                            h={50}
                            w={24}
                            alt={periodical.title}
                            fit="contain"
                            fallback={icon} />
                    </Center>

                    <div style={{ flex: 1 }}>
                        <Text>{periodical.title}</Text>

                        {periodical.description && (
                            <Text opacity={0.6} size="xs" truncate="end">
                                {periodical.description}
                            </Text>
                        )}
                    </div>
                </Group>
            </Spotlight.Action>)}
    </SpotlightActionsGroup>);
};

PeriodicalsSearchSection.propTypes = {
    t: PropTypes.any.isRequired,
    navigate: PropTypes.any.isRequired,
    libraryId: PropTypes.string.isRequired,
    query: PropTypes.string,
    pageSize: PropTypes.number,
    onSearchStatusChange: PropTypes.func,
    onDataStatusChange: PropTypes.func,
};

export default PeriodicalsSearchSection;
