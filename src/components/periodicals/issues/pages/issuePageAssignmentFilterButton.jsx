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
import helpers from "/src/util";
import { AssignmentStatus, BookStatus } from "/src/models";

// ------------------------------------------------------

const IssuePageAssignmentFilterButton = ({ issue, t }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [assignment, setAssignment] = useState(AssignmentStatus.All);


    useEffect(() => {
        const writerAssignment = searchParams.get("assignment");
        const readerAssignment = searchParams.get("reviewerAssignment");

        if (writerAssignment === AssignmentStatus.All && readerAssignment === AssignmentStatus.All) {
            setAssignment(AssignmentStatus.All);
        } if (!writerAssignment && !readerAssignment) {
            setAssignment(AssignmentStatus.All);
        } else {
            if (writerAssignment === readerAssignment) {
                setAssignment(writerAssignment);
            } else {
                if (issue.status === BookStatus.BeingTyped && writerAssignment) {
                    setAssignment(writerAssignment);
                } else if (issue.status === BookStatus.ProofRead && readerAssignment) {
                    setAssignment(readerAssignment);
                } else {
                    setAssignment(AssignmentStatus.AssignedToMe);
                }
            }
        }
    }, [issue, searchParams]);

    const setNewAssignment = (newAssignmentStatus) => {
        if (newAssignmentStatus == AssignmentStatus.All) {
            navigate(
                helpers.buildLinkToIssuePagesPage({
                    location,
                    pageNumber: 1,
                    assignmentFilter: AssignmentStatus.All,
                    reviewerAssignmentFilter: AssignmentStatus.All
                })
            );
        } else {

            let url = helpers.buildLinkToIssuePagesPage({
                location,
                pageNumber: 1,
                assignmentFilter: newAssignmentStatus,
                reviewerAssignmentFilter: newAssignmentStatus
            })
            navigate(url);
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

export default IssuePageAssignmentFilterButton;
