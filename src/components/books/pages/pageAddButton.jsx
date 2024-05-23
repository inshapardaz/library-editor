import React from 'react';

// Third party libraries
import { Button, Dropdown, Space } from "antd";
import { FaFilePdf, FaPlus } from "react-icons/fa";

// Local imports
import {
    FaFileArrowUp,
    FaFileCirclePlus,
    FaFileZipper,
    FaChevronDown,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

// ------------------------------------------------------

const PageAddButton = ({ libraryId, book, t }) => {
    const items = [
        {
            key: "pages-add-new",
            icon: <FaFileCirclePlus />,
            label: (
                <Link to={`/libraries/${libraryId}/books/${book.id}/pages/add`}>
                    {t("page.actions.add.label")}
                </Link>
            ),
        },
        {
            key: "pages-add-upload",
            icon: <FaFileArrowUp />,
            label: (
                <Link to={`/libraries/${libraryId}/books/${book.id}/pages/upload`}>
                    {t("page.actions.uploadPage.label")}
                </Link>
            ),
        },
        {
            key: "pages-add-pdf",
            icon: <FaFilePdf />,
            label: (
                <Link to={`/libraries/${libraryId}/books/${book.id}/pages/upload`}>
                    {t("page.actions.uploadPdf.label")}
                </Link>),
        },
        {
            key: "pages-add-zip",
            icon: <FaFileZipper />,
            label: (
                <Link to={`/libraries/${libraryId}/books/${book.id}/pages/upload`}>
                    {t("page.actions.uploadZip.label")}
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

export default PageAddButton;
