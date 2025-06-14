import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library imports
import { ActionIcon, Button, Center, Loader, rem, Text } from "@mantine/core";
import { spotlight, Spotlight } from "@mantine/spotlight";

// Local imports
import { IconSearch } from "@/components/icons";
import BooksSearchSection from './booksSearchSection';
import AuthorsSearchSection from './authorsSearchSection';
import WritingsSearchSection from './writingsSearchSection';
import PoetriesSearchSection from './poetriesSearchSection';
import SeriesSearchSection from './seriesSearchSection';
import PeriodicalsSearchSection from './periodicalsSearchSection';
import If from '@/components/if';

//-----------------------------
const SearchBox = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { libraryId } = useParams();
    const [query, setQuery] = useState('');
    const [loadingStates, setLoadingStates] = useState({});
    const [dataStates, setDataStates] = useState({});

    const handleSearchStatus = useCallback((section, isLoading) => {
        setLoadingStates((prev) => ({ ...prev, [section]: isLoading }));
    }, []);

    const handleDataStatus = useCallback((section, hasData) => {
        setDataStates((prev) => ({ ...prev, [section]: hasData }));
    }, []);

    const isAnyLoading = useMemo(() => Object.values(loadingStates).some((isLoading) => isLoading), [loadingStates]);
    const isAllFinished = useMemo(() => Object.values(loadingStates).every((isLoading) => !isLoading && Object.keys(loadingStates).length > 0), [loadingStates]);
    const hasAnyData = useMemo(() => Object.values(dataStates).some((hasData) => hasData), [dataStates]);

    useEffect(() => {
        if (isAnyLoading) {
            console.log("At least one section is loading...");
        } else if (isAllFinished) {
            console.log("All sections have finished loading.");
        }
    }, [isAnyLoading, isAllFinished]);

    return (<>
        <Spotlight.Root query={query} onQueryChange={setQuery} scrollable
            shortcut={['mod + K', 'mod + P', '/']} clearQueryOnClose >
            <Spotlight.Search placeholder={t('search.placeholder')}
                leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />} />
            <Spotlight.ActionsList>
                <If condition={isAnyLoading} >
                    <Center mt="xl"><Loader /></Center>
                </If>
                <If condition={!isAnyLoading && isAllFinished && !hasAnyData}>
                    <Center>
                        <Text>{t('search.empty')}</Text>
                    </Center>
                </If>
                <BooksSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('books', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('books', hasData)}
                />
                <AuthorsSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('authors', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('authors', hasData)}
                />
                <WritingsSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('writings', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('writings', hasData)}
                />
                <PoetriesSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('poetries', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('poetries', hasData)}
                />
                <SeriesSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('series', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('series', hasData)}
                />
                <PeriodicalsSearchSection
                    t={t}
                    navigate={navigate}
                    libraryId={libraryId}
                    query={query}
                    onSearchStatusChange={(isLoading) => handleSearchStatus('periodicals', isLoading)}
                    onDataStatusChange={(hasData) => handleDataStatus('periodicals', hasData)}
                />
            </Spotlight.ActionsList>
            <Button fullWidth
                variant="outline"
                size="sm"
                mt="xs"
                color="gray"
                onClick={() => navigate(`/libraries/${libraryId}/search`)}>
                {t('search.searchMore')}
            </Button>
        </Spotlight.Root >
        <ActionIcon onClick={spotlight.open}
            variant="default"
            size="xl"
            aria-label="search"
        >
            <IconSearch size={16} stroke={1.5} />
        </ActionIcon>
    </>)
};

export default SearchBox;
