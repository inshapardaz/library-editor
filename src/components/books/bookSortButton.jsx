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
import helpers from "../../helpers";
import SortDirection from "../../models/sortDirection";

// ------------------------------------------------------

export default function BookSortButton({ sortBy, sortDirection, t }) {
    const navigate = useNavigate();
    const location = useLocation();

    const setSortDirection = (newSortDirection) => {
        navigate(
            helpers.updateLinkToBooksPage(location, {
                pageNumber: 1,
                sortDirection: newSortDirection,
            })
        );
    };
    const setSortBy = (newSortBy) => {
        navigate(
            helpers.updateLinkToBooksPage(location, {
                pageNumber: 1,
                sortBy: newSortBy,
            })
        );
    };

    const items = [
        {
            key: "title",
            icon: <FaSortAlphaUp />,
            label: t("books.sort.title"),
            onClick: () => setSortBy(""),
        },
        {
            key: "datecreated",
            icon: <FaRegCalendarPlus />,
            label: t("books.sort.dateCreated"),
            onClick: () => setSortBy("dateCreated"),
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

    console.log(sortDirection);
    console.log(sortBy);

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
}
