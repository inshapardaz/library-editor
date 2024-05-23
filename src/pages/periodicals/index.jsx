import React from 'react';
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button } from "antd";
import { FaPlus } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local Imports
import PageHeader from "/src/components/layout/pageHeader";
import PeriodicalsList from "/src/components/periodicals/periodicalsList";
import ContentsContainer from "/src/components/layout/contentContainer";
//------------------------------------------------

const PeriodicalsHomePage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");

    const addButton = (
        <Link to={`/libraries/${libraryId}/periodicals/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("periodical.actions.add.label")}
            </Button>
        </Link>
    );
    return (
        <>
            <PageHeader title={t("periodicals.title")} icon={<ImNewspaper style={{ width: 36, height: 36 }} />} actions={addButton} />
            <ContentsContainer>
                <PeriodicalsList libraryId={libraryId} query={query} pageNumber={pageNumber} pageSize={pageSize} />
            </ContentsContainer>
        </>
    );
};

export default PeriodicalsHomePage;
