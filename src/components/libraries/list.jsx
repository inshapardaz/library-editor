import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, Input, List, Space, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

// Internal Imports
import { useGetLibrariesQuery } from "~/src/store/slices/librariesSlice";
import { grid, updateLinkToLibrariesPage } from "~/src/util";
import DataContainer from "~/src/components/layout/dataContainer";
import LibraryCard from "./libraryCard";
import LibraryListItem from "./libraryListItem";
import { FaPlus } from "react-icons/fa";

// ------------------------------------------------------
const ShowMoreButton = ({ t }) => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                textAlign: "center",
                marginTop: 12,
                height: 32,
                lineHeight: "32px",
            }}
        >
            <Button size="small" onClick={() => navigate(`/libraries`)}>
                {t("actions.seeMore")}
            </Button>
        </div>
    );
}

const LibrariesList = ({
    query,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    showSearch = true,
    showMore = false
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(query);
    const [showList, setShowList] = useLocalStorage("library-list-view", false);
    const { data: libraries, isError, isFetching } = useGetLibrariesQuery({
        query,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    });

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            updateLinkToLibrariesPage(location, {
                pageNumber: newPage,
                pageSize: newPageSize,
            })
        );
    };

    const onSearch = () => {
        navigate(
            updateLinkToLibrariesPage(location, {
                pageNumber: 1,
                query: search,
            })
        );
    };

    const renderItem = (l) => {
        if (showList) {
            return (<LibraryListItem key={l.id} library={l} t={t} />);
        } else {
            return (
                <List.Item>
                    <LibraryCard key={l.id} library={l} t={t} />
                </List.Item>
            );
        }
    };

    return (
        <DataContainer
            busy={isFetching}
            error={isError}
            empty={libraries && libraries.data && libraries.data.length < 1}
            emptyContent={
                libraries && libraries.links && libraries.links.create &&
                (<Space>
                    <Button size="small" icon={<FaPlus />}
                        onClick={() => navigate(`/libraries/add`)}>
                        {t("library.actions.add.label")}
                    </Button>
                </Space>)
            }
            extra={
                < Space >
                    {showSearch && (
                        <Input.Search
                            size="medium"
                            value={search}
                            allowClear
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={onSearch}
                            placeholder={t("libraries.search.placeholder")}
                        />
                    )}
                    <Switch
                        checkedChildren={t("actions.list")}
                        unCheckedChildren={t("actions.card")}
                        checked={showList}
                        onChange={(checked) => setShowList(checked)}
                    />
                </Space >
            }
        >
            <List
                loading={isFetching}
                size="large"
                grid={showList ? null : grid}
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={libraries ? libraries.data : []}
                loadMore={showMore && <ShowMoreButton t={t} />}
                renderItem={renderItem}
                pagination={!showMore && {
                    onChange: onPageChanged,
                    pageSize: libraries ? libraries.pageSize : 0,
                    current: libraries ? libraries.currentPageIndex : 0,
                    total: libraries ? libraries.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    hideOnSinglePage: true,
                    pageSizeOptions: [12, 24, 48, 96],
                }}
            />
        </DataContainer >
    );
};

export default LibrariesList;
