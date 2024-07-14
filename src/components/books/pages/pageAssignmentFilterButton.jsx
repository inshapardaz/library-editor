import React, { useEffect, useState } from 'react';
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
} from "/src/icons";

// Local Import
import { updateLinkToBooksPagesPage } from "/src/util";
import { AssignmentStatus, BookStatus } from "/src/models";

// ------------------------------------------------------

const PageAssignmentFilterButton = ({ book, t }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [assignment, setAssignment] = useState(AssignmentStatus.All);


    useEffect(() => {
        const writerAssignment = searchParams.get("assignment");
        const readerAssignment = searchParams.get("reviewerAssignment");

        if (writerAssignment === AssignmentStatus.All && readerAssignment ===  AssignmentStatus.All){
                setAssignment(AssignmentStatus.All);
        } if (!writerAssignment && !readerAssignment){
            setAssignment(AssignmentStatus.All);
        } else {
            if (writerAssignment === readerAssignment) {
                setAssignment(writerAssignment);
            } else {
                if (book.status === BookStatus.BeingTyped && writerAssignment) {
                    setAssignment(writerAssignment);
                } else if (book.status === BookStatus.ProofRead && readerAssignment) {
                    setAssignment(readerAssignment);
                } else {
                    setAssignment(AssignmentStatus.AssignedToMe);
                }
            }
        }
    }, [book, searchParams]);

    const setNewAssignment = (newAvailabilityStatus) => {
        if (newAvailabilityStatus == AssignmentStatus.All) {
            navigate(
                updateLinkToBooksPagesPage(
                    location, {
                    pageNumber: 1,
                    assignmentFilter: AssignmentStatus.All,
                    reviewerAssignmentFilter: AssignmentStatus.All,
                }
                )
            );
        } else {
            navigate(
                updateLinkToBooksPagesPage(
                    location, {
                    pageNumber: 1,
                    assignmentFilter: BookStatus.BeingTyped === book.status ? newAvailabilityStatus : null,
                    reviewerAssignmentFilter: BookStatus.ProofRead === book.status ? newAvailabilityStatus : null,
                }
                )
            );
        }
    };

    const items = [
        {
            icon: <FaUsers />,
            label: t("pages.assignment.all"),
            onClick: () => setNewAssignment(AssignmentStatus.All),
            key: AssignmentStatus.All,
        },
        {
            icon: <FaUserAlt />,
            label: t("pages.assignment.mine"),
            onClick: () => setNewAssignment(AssignmentStatus.AssignedToMe),
            key: AssignmentStatus.AssignedToMe,
        },
        {
            icon: <FaUserFriends />,
            label: t("pages.assignment.assigned"),
            onClick: () => setNewAssignment(AssignmentStatus.Assigned),
            key: AssignmentStatus.Assigned,
        },
        {
            icon: <FaUserSlash />,
            label: t("pages.assignment.unassigned"),
            onClick: () => setNewAssignment(AssignmentStatus.Unassigned),
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
};

export default PageAssignmentFilterButton;
