import React from 'react';
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button } from "antd";
import { FaFeatherAlt, FaPlus } from "/src/icons";

// Local Imports
import PageHeader from "/src/components/layout/pageHeader";
import AuthorsList from "/src/components/author/authorsList";
import ContentsContainer from "/src/components/layout/contentContainer";

// ---------------------------------------------------

const AuthorsHomePage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const authorType = searchParams.get("authorType");
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");

    const addButton = (
        <Link to={`/libraries/${libraryId}/authors/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("author.actions.add.label")}
            </Button>
        </Link>
    );
    return (
        <>
            <PageHeader
                title={t("authors.title")}
                icon={<FaFeatherAlt style={{ width: 36, height: 36 }} />}
                actions={addButton}
            />
            <ContentsContainer>
                <AuthorsList
                    libraryId={libraryId}
                    query={query}
                    authorType={authorType}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                />
            </ContentsContainer>
        </>
    );
}
export default AuthorsHomePage;
