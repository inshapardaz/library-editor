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
import AssignmentStatus from "../../../models/assignmentStatus";

// ------------------------------------------------------

export default function PageAssignmentFilterButton({ libraryId, bookId, t }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");
    const assignment =
        searchParams.get("assignment") ?? AssignmentStatus.AssignedToMe;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const setAssignment = (newAvailabilityStatus) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                libraryId,
                bookId,
                1,
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
            onClick: () => setAssignment(AssignmentStatus.All),
            key: AssignmentStatus.All,
        },
        {
            icon: <FaUserAlt />,
            label: t("pages.assignment.mine"),
            onClick: () => setAssignment(AssignmentStatus.AssignedToMe),
            key: AssignmentStatus.AssignedToMe,
        },
        {
            icon: <FaUserFriends />,
            label: t("pages.assignment.assigned"),
            onClick: () => setAssignment(AssignmentStatus.Assigned),
            key: AssignmentStatus.Assigned,
        },
        {
            icon: <FaUserSlash />,
            label: t("pages.assignment.unassigned"),
            onClick: () => setAssignment(AssignmentStatus.Unassigned),
            key: AssignmentStatus.Unassigned,
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
