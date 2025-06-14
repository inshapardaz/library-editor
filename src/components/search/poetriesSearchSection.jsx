import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef } from 'react';

// Ui Library Imports
import { Group, Center, Text } from '@mantine/core';
import { Spotlight, SpotlightActionsGroup } from '@mantine/spotlight';

// Local imports
import { IconPoetries } from "@/components/icons";
import Img from '@/components/img';
import { useGetArticlesQuery } from '@/store/slices/articles.api';

//-----------------------------
const PoetriesSearchSection = ({ t, navigate, libraryId, query, pageSize = 3,
    onSearchStatusChange = () => { },
    onDataStatusChange = () => { } }) => {
    const {
        data: poetries, isError: poetryError, isFetching: poetryLoading,
    } = useGetArticlesQuery({
        libraryId,
        query,
        type: 'poetry',
        pageSize
    }, {
        skip: query.length < 3,
        refetchOnReconnect: true,
        abortOnUnmount: true,
    });

    const hasPoetries = useMemo(() => !poetryLoading && !poetryError && poetries?.data?.length > 0, [poetryLoading, poetryError, poetries]);

    const icon = <IconPoetries width={24} stroke={1.5} />;

    const prevPoetriesLoading = useRef();
    const prevHasData = useRef();

    useEffect(() => {
        if (prevPoetriesLoading.current !== poetryLoading) {
            onSearchStatusChange(poetryLoading);
            prevPoetriesLoading.current = poetryLoading;
        }
        const hasData = !!poetries?.data?.length;
        if (prevHasData.current !== hasData) {
            onDataStatusChange(hasData);
            prevHasData.current = hasData;
        }
    }, [poetryLoading, poetries?.data, onSearchStatusChange, onDataStatusChange]);

    if (!hasPoetries) {
        if (query.length < 3) {
            return (<Spotlight.Action key={t('header.poetry')}
                label={t('header.poetry')}
                description={t('poetries.description')}
                leftSection={icon}
                onClick={() => navigate(`/libraries/${libraryId}/poetry`)} />);
        }

        return null;
    }

    return (<SpotlightActionsGroup label={t('header.poetry')}>
        {poetries.data
            .map((poetry) => <Spotlight.Action key={poetry.id}
                onClick={() => navigate(`/libraries/${libraryId}/poetry/${poetry.id}`)}>
                <Group wrap="nowrap" w="100%">
                    <Center>
                        <Img
                            src={poetry.links.image}
                            h={50}
                            w={24}
                            alt={poetry.title}
                            fit="contain"
                            fallback={icon} />
                    </Center>
                    <div style={{ flex: 1 }}>
                        <Text>{poetry.title}</Text>

                        {poetry.description && (
                            <Text opacity={0.6} size="xs" truncate="end">
                                {poetry.description}
                            </Text>
                        )}
                    </div>
                </Group>
            </Spotlight.Action>)}
    </SpotlightActionsGroup>);
};

PoetriesSearchSection.propTypes = {
    t: PropTypes.any.isRequired,
    navigate: PropTypes.any.isRequired,
    libraryId: PropTypes.string.isRequired,
    query: PropTypes.string,
    pageSize: PropTypes.number,
    onSearchStatusChange: PropTypes.func,
    onDataStatusChange: PropTypes.func,
};

export default PoetriesSearchSection;
