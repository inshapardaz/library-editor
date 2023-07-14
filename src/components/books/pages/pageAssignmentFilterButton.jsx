import { useNavigate, useSearchParams } from "react-router-dom";

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import {
    FaChevronDown,
    FaUser,
    FaUserAlt,
    FaUserFriends,
    FaUserSlash,
    FaUsers,
} from "react-icons/fa";

// Local Import
import helpers from "../../../helpers";

// ------------------------------------------------------

export default function PageAssignmentFilterButton({ libraryId, bookId, t }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");
    const assignment = searchParams.get("assignment") ?? "Mine";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const setAssignment = (newAvailabilityStatus) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                libraryId,
                bookId,
                pageNumber,
                pageSize,
                status,
                newAvailabilityStatus
            )
        );
    };

    const items = [
        {
            icon: <FaUsers />,
            label: t("pages.assignment.all"),
            onClick: () => setAssignment("all"),
            key: "all",
        },
        {
            icon: <FaUserAlt />,
            label: t("pages.assignment.mine"),
            onClick: () => setAssignment("assignedToMe"),
            key: "assignedToMe",
        },
        {
            icon: <FaUserFriends />,
            label: t("pages.assignment.assigned"),
            onClick: () => setAssignment("assigned"),
            key: "assigned",
        },
        {
            icon: <FaUserSlash />,
            label: t("pages.assignment.unassigned"),
            onClick: () => setAssignment("unassigned"),
            key: "unassigned",
        },
    ];
    return (
        <Dropdown menu={{ items, selectedKeys: assignment }}>
            <Button>
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaUser />
                </Space>
            </Button>
        </Dropdown>
    );
}
