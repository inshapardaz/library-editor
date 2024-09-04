import React from 'react';
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { ImLibrary } from "/src/icons";

// Local Imports
import { SortDirection } from "/src/models";
import LibrariesList from "/src/components/libraries/list";
import PageHeader from "/src/components/layout/pageHeader";
import ContentsContainer from "/src/components/layout/contentContainer";

// -------------------------------------------------------

const LibrariesHome = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Descending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    return (
        <>
            <PageHeader title={t("libraries.title")} icon={<ImLibrary size={48} />} />
            <ContentsContainer>
                <LibrariesList
                    query={query}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    showSearch />
            </ContentsContainer>
        </>
    );
};

export default LibrariesHome;
