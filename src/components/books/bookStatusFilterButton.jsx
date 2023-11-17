import { useLocation, useNavigate } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaChevronDown,
    FaFilter,
} from "react-icons/fa";

// Local Import
import helpers from "../../helpers";
import BookStatus from "../../models/bookStatus";
import BookStatusIcon from "./BookStatusIcon";

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
            icon: <BookStatusIcon status={BookStatus.All} />,
            label: t("pages.filters.all"),
            onClick: () => setStatus(BookStatus.All),
            key: BookStatus.All,
        },
        {
            icon: <BookStatusIcon status={BookStatus.AvailableForTyping} />,
            label: t("pages.filters.availableToType"),
            onClick: () => setStatus(BookStatus.AvailableForTyping),
            key: BookStatus.AvailableForTyping,
        },
        {
            icon: <BookStatusIcon status={BookStatus.BeingTyped} />,
            label: t("pages.filters.typing"),
            onClick: () => setStatus(BookStatus.BeingTyped),
            key: BookStatus.BeingTyped,
        },
        {
            icon: <BookStatusIcon status={BookStatus.ReadyForProofRead} />,
            label: t("pages.filters.typed"),
            onClick: () => setStatus(BookStatus.ReadyForProofRead),
            key: BookStatus.ReadyForProofRead,
        },
        {
            icon: <BookStatusIcon status={BookStatus.ProofRead} />,
            label: t("pages.filters.proofreading"),
            onClick: () => setStatus(BookStatus.ProofRead),
            key: BookStatus.ProofRead,
        },
        {
            icon: <BookStatusIcon status={BookStatus.Published} />,
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
