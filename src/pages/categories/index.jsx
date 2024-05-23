import React from 'react';
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button } from "antd";
import { FaPlus, FaTags } from "/src/icons";

// Local Imports
import PageHeader from "/src/components/layout/pageHeader";
import CategoriesList from "/src/components/categories/categoriesList";
import ContentsContainer from "/src/components/layout/contentContainer";

function CategoriesHomePage() {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");

    const addButton = (
        <Link to={`/libraries/${libraryId}/categories/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("category.actions.add.label")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader title={t("categories.title")} icon={<FaTags style={{ width: 36, height: 36 }} />} actions={addButton} />
            <ContentsContainer>
                <CategoriesList libraryId={libraryId} query={query} pageNumber={pageNumber} pageSize={pageSize} />
            </ContentsContainer>
        </>
    );
}
export default CategoriesHomePage;
