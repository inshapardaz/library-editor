import React from 'react';
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button } from "antd";
import { FaPlus } from "/src/icons";
import { ImBooks } from "/src/icons";

// Local Imports
import PageHeader from "/src/components/layout/pageHeader";
import SeriesList from "/src/components/series/seriesList";
import ContentsContainer from "/src/components/layout/contentContainer";

// ========================================================

const SeriesHomePage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize") ?? 12;

    const addButton = (
        <Link to={`/libraries/${libraryId}/series/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("series.actions.add.label")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader
                title={t("series.title")}
                icon={<ImBooks style={{ width: 36, height: 36 }} />}
                actions={addButton}
            />
            <ContentsContainer>
                <SeriesList
                    libraryId={libraryId}
                    query={query}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                />
            </ContentsContainer>
        </>
    );
};

export default SeriesHomePage;
