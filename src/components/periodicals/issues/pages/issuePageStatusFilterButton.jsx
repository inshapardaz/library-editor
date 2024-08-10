import React from 'react';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";

// Local Import
import {
    FaCheck,
    FaChevronDown,
    FaFile,
    FaFileAlt,
    FaFileSignature,
    FaFilter,
    FaGlasses,
    FaStarOfLife,
} from "/src/icons";
import helpers from "/src/util";

// ------------------------------------------------------

const IssuePageStatusFilterButton = ({ t }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const status = searchParams.get("status") ?? "Typing";

    const setStatus = (newStatus) => {
        navigate(
            helpers.buildLinkToIssuePagesPage({
                location,
                pageNumber: 1,
                statusFilter: newStatus
            })
        );
    };
    const items = [
        {
            icon: <FaStarOfLife />,
            label: t("pages.filters.all"),
            onClick: () => setStatus("all"),
            key: "all",
        },
        {
            icon: <FaFile />,
            label: t("pages.filters.availableToType"),
            onClick: () => setStatus("Available"),
            key: "Available",
        },
        {
            icon: <FaFileSignature />,
            label: t("pages.filters.typing"),
            onClick: () => setStatus("Typing"),
            key: "Typing",
        },
        {
            icon: <FaFileAlt />,
            label: t("pages.filters.typed"),
            onClick: () => setStatus("Typed"),
            key: "Typed",
        },
        {
            icon: <FaGlasses />,
            label: t("pages.filters.proofreading"),
            onClick: () => setStatus("InReview"),
            key: "InReview",
        },
        {
            icon: <FaCheck />,
            label: t("pages.filters.completed"),
            onClick: () => setStatus("Completed"),
            key: "Completed",
        },
    ];
    return (
        <Dropdown menu={{ items, selectedKeys: status }}>
            <Button>
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaFilter />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default IssuePageStatusFilterButton;
