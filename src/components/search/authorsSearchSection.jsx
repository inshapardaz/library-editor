import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef } from 'react';

// Ui Library Imports
import { Group, Center, Text } from '@mantine/core';
import { Spotlight, SpotlightActionsGroup } from '@mantine/spotlight';

// Local imports
import { IconAuthors } from "@/components/icons";
import { useGetAuthorsQuery } from '@/store/slices/authors.api';
import Img from '@/components/img';

//-----------------------------
const AuthorsSearchSection = ({ t, navigate, libraryId, query, pageSize = 3,
    onSearchStatusChange = () => { },
    onDataStatusChange = () => { } }) => {
    const {
        data: authors, isError: authorsError, isFetching: authorsLoading,
    } = useGetAuthorsQuery(
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

    const hasAuthors = useMemo(() => !authorsError && !authorsLoading && authors?.data?.length > 0, [authorsError, authorsLoading, authors]);

    const icon = <IconAuthors width={24} stroke={1.5} />;

    const prevAuthorsLoading = useRef();
    const prevHasData = useRef();

    useEffect(() => {
        if (prevAuthorsLoading.current !== authorsLoading) {
            onSearchStatusChange(authorsLoading);
            prevAuthorsLoading.current = authorsLoading;
        }
        const hasData = !!authors?.data?.length;
        if (prevHasData.current !== hasData) {
            onDataStatusChange(hasData);
            prevHasData.current = hasData;
        }
    }, [authorsLoading, authors?.data, onSearchStatusChange, onDataStatusChange]);

    if (!hasAuthors) {
        if (query.length < 3) {
            return (<Spotlight.Action key={t('header.authors')}
                label={t('header.authors')}
                description={t('authors.description')}
                leftSection={icon}
                onClick={() => navigate(`/libraries/${libraryId}/authors`)} />);
        }

        return null;
    }

    return (<SpotlightActionsGroup label={t('header.authors')}>
        {authors.data
            .map((author) => <Spotlight.Action key={author.id}
                onClick={() => navigate(`/libraries/${libraryId}/authors/${author.id}`)}>
                <Group wrap="nowrap" w="100%">
                    <Center>
                        <Img
                            src={author.links.image}
                            h={50}
                            w={24}
                            alt={author.title}
                            fit="contain"
                            fallback={icon} />
                    </Center>

                    <div style={{ flex: 1 }}>
                        <Text>{author.name}</Text>

                        {author.description && (
                            <Text opacity={0.6} size="xs" truncate="end">
                                {author.description}
                            </Text>
                        )}
                    </div>
                </Group>
            </Spotlight.Action>)}
    </SpotlightActionsGroup>);
};

AuthorsSearchSection.propTypes = {
    t: PropTypes.any.isRequired,
    navigate: PropTypes.any.isRequired,
    libraryId: PropTypes.string.isRequired,
    query: PropTypes.string,
    pageSize: PropTypes.number,
    onSearchStatusChange: PropTypes.func,
    onDataStatusChange: PropTypes.func,
};

export default AuthorsSearchSection;
