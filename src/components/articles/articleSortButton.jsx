import { useLocation, useNavigate } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaChevronDown,
    FaRegCalendarPlus,
    FaSort,
    FaSortAlphaUp,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";

// Local Imports
import { updateLinkToArticlesPage } from "~/src/util";
import { SortDirection } from "~/src/models";

// ------------------------------------------------------

const ArticleSortButton = ({ sortBy, sortDirection, t }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const setSortDirection = (newSortDirection) => {
        navigate(
            updateLinkToArticlesPage(location, {
                pageNumber: 1,
                sortDirection: newSortDirection,
            })
        );
    };
    const setSortBy = (newSortBy) => {
        navigate(
            updateLinkToArticlesPage(location, {
                pageNumber: 1,
                sortBy: newSortBy,
            })
        );
    };

    const items = [
        {
            key: "title",
            icon: <FaSortAlphaUp />,
            label: t("articles.sort.title"),
            onClick: () => setSortBy(""),
        },
        {
            key: "lastModified",
            icon: <FaRegCalendarPlus />,
            label: t("articles.sort.lastModified"),
            onClick: () => setSortBy("lastModified"),
        },
        {
            type: "divider",
        },
        {
            key: SortDirection.Descending,
            icon: <FaSortAmountDown />,
            label: t("sort.descending"),
            onClick: () => setSortDirection(SortDirection.Descending),
        },
        {
            key: SortDirection.Ascending,
            icon: <FaSortAmountUp />,
            label: t("sort.ascending"),
            onClick: () => setSortDirection(SortDirection.Ascending),
        },
    ];

    return (
        <Dropdown
            menu={{
                items,
                selectedKeys: [
                    sortDirection?.toLowerCase() ?? SortDirection.Ascending,
                    sortBy?.toLowerCase() ?? "title",
                ],
            }}
        >
            <Button size="medium">
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaSort />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default ArticleSortButton;
