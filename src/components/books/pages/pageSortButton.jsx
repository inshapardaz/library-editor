import React from 'react';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaChevronDown,
    FaSort,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";

// Local Imports
import { updateLinkToBooksPagesPage } from "/src/util";
// ------------------------------------------------------

const PageSortButton = ({ t }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const sortDirection = searchParams.get("sortDirection") || "ascending";

    const setSortDirection = (newSortDirection) => {
        navigate(
            updateLinkToBooksPagesPage(
                location, {
                sortDirection: newSortDirection
            }
            )
        );
    };

    const items = [
        {
            key: "descending",
            icon: <FaSortAmountDown />,
            label: t("sort.descending"),
            onClick: () => setSortDirection("descending"),
        },
        {
            key: "ascending",
            icon: <FaSortAmountUp />,
            label: t("sort.ascending"),
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
};

export default PageSortButton;
