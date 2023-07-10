import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, List, Switch } from "antd";
import { FaFeatherAlt, FaPlus } from "react-icons/fa";

// Local Imports
import DataContainer from "../layout/dataContainer";
import AuthorCard from "./authorCard";
import helpers from "../../helpers";
import AuthorListItem from "./authorListItem";
import { useGetAuthorsQuery } from "../../features/api/authorsSlice";
// ------------------------------------------------------

const grid = {
    gutter: 4,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
};

// ------------------------------------------------------

function AuthorsList({ libraryId, query, authorType, pageNumber, pageSize }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showList, setShowList] = useLocalStorage("author-list-view", false);

    const {
        refetch,
        data: authors,
        error,
        isFetching,
    } = useGetAuthorsQuery({
        libraryId,
        query,
        authorType,
        pageNumber,
        pageSize,
    });

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (author) => {
        if (showList) {
            return (
                <AuthorListItem
                    key={author.id}
                    libraryId={libraryId}
                    author={author}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <AuthorCard
                        key={author.id}
                        libraryId={libraryId}
                        author={author}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            helpers.buildLinkToAuthorsPage(
                libraryId,
                newPage,
                newPageSize,
                query,
                authorType
            )
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("authors.errors.loading.title")}
            errorSubTitle={t("authors.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<FaFeatherAlt size="5em" />}
            emptyDescription={t("authors.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/authors/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("author.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={authors && authors.data && authors.data.length < 1}
            extra={
                <Switch
                    checkedChildren={t("actions.list")}
                    unCheckedChildren={t("actions.card")}
                    checked={showList}
                    onChange={toggleView}
                />
            }
        >
            <List
                grid={showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={authors ? authors.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: authors ? authors.pageSize : 0,
                    current: authors ? authors.currentPageIndex : 0,
                    total: authors ? authors.totalCount : 0,
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

export default AuthorsList;
