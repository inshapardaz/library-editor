import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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
import { updateLinkToBooksPagesPage } from "~/src/util";
import { AssignmentStatus, BookStatus } from "~/src/models";

// ------------------------------------------------------

export default function PageAssignmentFilterButton({ book, t }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const assignment =
        (book.status === BookStatus.BeingTyped && searchParams.get("assignment")) ||
            (book.status === BookStatus.ProofRead && searchParams.get("reviewerAssignment"))
            ? AssignmentStatus.AssignedToMe
            : AssignmentStatus.All;

    const setAssignment = (newAvailabilityStatus) => {
        navigate(
            updateLinkToBooksPagesPage(
                location, {
                pageNumber: 1,
                assignmentFilter: BookStatus.BeingTyped === book.status ? newAvailabilityStatus : null,
                reviewerAssignmentFilter: BookStatus.ProofRead === book.status ? newAvailabilityStatus : null,
            }
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
