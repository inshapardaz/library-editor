import { useLocation, useNavigate } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaCheck,
    FaChevronDown,
    FaFile,
    FaFileAlt,
    FaFileSignature,
    FaFilter,
    FaGlasses,
    FaStarOfLife,
} from "react-icons/fa";

// Local Import
import helpers from "../../helpers";
import BookStatus from "../../models/bookStatus";

// ------------------------------------------------------

export default function BookStatusFilterButton({ t, status }) {
    const navigate = useNavigate();
    const location = useLocation();

    const setStatus = (newStatus) => {
        navigate(
            helpers.updateLinkToBooksPage(location, {
                pageNumber: 1,
                status: newStatus,
            })
        );
    };

    const items = [
        {
            icon: <FaStarOfLife />,
            label: t("pages.filters.all"),
            onClick: () => setStatus(BookStatus.All),
            key: BookStatus.All,
        },
        {
            icon: <FaFile />,
            label: t("pages.filters.availableToType"),
            onClick: () => setStatus(BookStatus.AvailableForTyping),
            key: BookStatus.AvailableForTyping,
        },
        {
            icon: <FaFileSignature />,
            label: t("pages.filters.typing"),
            onClick: () => setStatus(BookStatus.BeingTyped),
            key: BookStatus.BeingTyped,
        },
        {
            icon: <FaFileAlt />,
            label: t("pages.filters.typed"),
            onClick: () => setStatus(BookStatus.ReadyForProofRead),
            key: BookStatus.ReadyForProofRead,
        },
        {
            icon: <FaGlasses />,
            label: t("pages.filters.proofreading"),
            onClick: () => setStatus(BookStatus.ProofRead),
            key: BookStatus.ProofRead,
        },
        {
            icon: <FaCheck />,
            label: t("pages.filters.completed"),
            onClick: () => setStatus(BookStatus.Published),
            key: BookStatus.Published,
        },
    ];
    return (
        <Dropdown menu={{ items, selectedKeys: status ?? BookStatus.All }}>
            <Button size="medium">
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaFilter />
                </Space>
            </Button>
        </Dropdown>
    );
}
