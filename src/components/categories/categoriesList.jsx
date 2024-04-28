import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// 3rd party libraries
import { Button, List } from "antd";
import { FaPlus, FaTags } from "react-icons/fa";

// Local Imports
import { useGetCategoriesQuery } from "~/src/store/slices/categoriesSlice";
import { buildLinkToCategoriesList } from "~/src/util";
import DataContainer from "~/src/components/layout/dataContainer";
import CategoryListItem from "./categoryListItem";
// ------------------------------------------------------

const SeriesList = ({ libraryId, query, pageNumber, pageSize }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        refetch,
        data: categories,
        error,
        isFetching,
    } = useGetCategoriesQuery({ libraryId, query, pageNumber, pageSize });

    const renderItem = (c) => (
        <CategoryListItem key={c.id} libraryId={libraryId} category={c} t={t} />
    );

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            buildLinkToCategoriesList(
                libraryId,
                newPage,
                newPageSize,
                query
            )
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("categories.errors.loading.title")}
            errorSubTitle={t("categories.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<FaTags size="5em" />}
            emptyDescription={t("categories.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/categories/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("category.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={categories && categories.data && categories.data.length < 1}
        >
            <List
                loading={isFetching}
                size="large"
                itemLayout="horizontal"
                dataSource={categories ? categories.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: categories ? categories.pageSize : 0,
                    current: categories ? categories.currentPageIndex : 0,
                    total: categories ? categories.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    pageSizeOptions: [12, 24, 48, 96],
                }}
                renderItem={renderItem}
            />
        </DataContainer>
    );
}

export default SeriesList;
