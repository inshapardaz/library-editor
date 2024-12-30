import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Libray imports
import { ActionIcon, rem } from "@mantine/core";
import { createSpotlight, Spotlight } from "@mantine/spotlight";

// Local imports
import { IconAuthors, IconBooks, IconSearch, IconWritings, IconSeries } from "../icons";
// import { useGetBooksQuery } from '@/store/slices/books.api';
// import { useGetAuthorsQuery } from '@/store/slices/authors.api';

//-----------------------------
const SearchBox = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { libraryId } = useParams();
    const [query, setQuery] = useState('');
    const [searchStore, searchSpotlight] = createSpotlight();
    // const {
    //     data: books,
    //     isError: booksError,
    //     isFetching: booksLoading,
    // } = useGetBooksQuery({
    //     libraryId,
    //     query,
    //     pageSize: 3
    // });

    // const {
    //     data: authors,
    //     isError: authorsError,
    //     isFetching: authorsLoading,
    // } = useGetAuthorsQuery({
    //     libraryId,
    //     query,
    //     pageSize: 3
    // });

    const actions = [
        {
            id: 'books',
            label: t('books.title'),
            description: t('books.description'),
            onClick: () => navigate(`/libraries/${libraryId}/books`),
            leftSection: <IconBooks style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
        },
        {
            id: 'writings',
            label: t('writings.title'),
            description: t('writings.description'),
            onClick: () => navigate(`/libraries/${libraryId}/writings`),
            leftSection: <IconWritings style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
        },
        {
            id: 'authors',
            label: t('authors.title'),
            description: t('authors.description'),
            onClick: () => navigate(`/libraries/${libraryId}/authors`),
            leftSection: <IconAuthors style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
        },
        {
            id: 'series',
            label: t('series.label'),
            description: t('series.description.label'),
            onClick: () => navigate(`/libraries/${libraryId}/series`),
            leftSection: <IconSeries style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
        },
    ];

    return (<>
        <Spotlight
            actions={actions}
            nothingFound={t('search.empty')}
            highlightQuery
            scrollable
            query={query}
            onQueryChange={setQuery}
            store={searchStore}
            searchProps={{
                leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
                placeholder: t('search.placeholder'),
            }}
        />
        <ActionIcon onClick={searchSpotlight.open}
            variant="default"
            size="xl"
            aria-label="search"
        >
            <IconSearch size={16} stroke={1.5} />
        </ActionIcon>
    </>)
};

export default SearchBox;