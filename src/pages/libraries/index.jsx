import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { ImLibrary } from "react-icons/im";
import { Button } from "antd";
import { FaPlus } from "react-icons/fa";

// Local Imports
import { SortDirection } from "~/src/models";
import LibrariesList from "~/src/components/libraries/list";
import PageHeader from "~/src/components/layout/pageHeader";
import ContentsContainer from "~/src/components/layout/contentContainer";

// -------------------------------------------------------

const LibrariesHome = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Descending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const addButton = (
        <Link to={`/libraries/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("book.actions.add.label")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader title={t("libraries.title")} icon={<ImLibrary />} actions={addButton} />
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
