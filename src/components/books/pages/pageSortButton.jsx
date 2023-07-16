import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaChevronDown,
    FaSort,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";
import helpers from "../../../helpers";

// ------------------------------------------------------

export default function PageSortButton({ libraryId, bookId, t }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");
    const assignment = searchParams.get("assignment");
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");
    const sortDirection = searchParams.get("sortDirection") || "ascending";

    const setSortDirection = (newSortDirection) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                location.pathname,
                pageNumber,
                pageSize,
                status,
                assignment,
                newSortDirection
            )
        );
    };

    const items = [
        {
            key: "descending",
            icon: <FaSortAmountDown />,
            label: t("pages.sort.descending"),
            onClick: () => setSortDirection("descending"),
        },
        {
            key: "ascending",
            icon: <FaSortAmountUp />,
            label: t("pages.sort.ascending"),
            onClick: () => setSortDirection("ascending"),
        },
    ];

    return (
        <Dropdown menu={{ items, selectedKeys: sortDirection }}>
            <Button>
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaSort />
                </Space>
            </Button>
        </Dropdown>
    );
}
