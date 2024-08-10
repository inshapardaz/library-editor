import React from 'react';

// Third party libraries
import { Button, Dropdown, Space } from "antd";

// Local imports
import {
    FaFilePdf,
    FaPlus,
    FaFileArrowUp,
    FaFileCirclePlus,
    FaFileZipper,
    FaChevronDown,
} from "/src/icons";
import { Link } from "react-router-dom";

// ------------------------------------------------------

const IssuePageAddButton = ({ libraryId, issue, t }) => {
    const items = [
        {
            key: "issue-pages-add-new",
            icon: <FaFileCirclePlus />,
            label: (
                <Link to={`/libraries/${libraryId}/periodicals/${issue?.periodicalId}/volumes/${issue?.volumeNumber}/issues/${issue?.issueNumber}/pages/add`}>
                    {t("issue.pages.actions.add.label")}
                </Link>
            ),
        },
        {
            key: "issue-pages-add-upload",
            icon: <FaFileArrowUp />,
            label: (
                <Link to={`/libraries/${libraryId}/periodicals/${issue?.periodicalId}/volumes/${issue?.volumeNumber}/issues/${issue?.issueNumber}/pages/upload`}>
                    {t("issue.pages.actions.uploadPage.label")}
                </Link>
            ),
        },
        {
            key: "issue-pages-add-pdf",
            icon: <FaFilePdf />,
            label: (
                <Link to={`/libraries/${libraryId}/periodicals/${issue?.periodicalId}/volumes/${issue?.volumeNumber}/issues/${issue?.issueNumber}/pages/upload`}>
                    {t("issue.pages.actions.uploadPdf.label")}
                </Link>),
        },
        {
            key: "issue-pages-add-zip",
            icon: <FaFileZipper />,
            label: (
                <Link to={`/libraries/${libraryId}/periodicals/${issue?.periodicalId}/volumes/${issue?.volumeNumber}/issues/${issue?.issueNumber}/pages/upload`}>
                    {t("issue.pages.actions.uploadZip.label")}
                </Link>),
        },
    ];
    return (
        <Dropdown menu={{ items }}>
            <Button>
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaPlus />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default IssuePageAddButton;
