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
import { updateLinkToArticlesPage } from "~/src/util";
import { EditingStatus } from "~/src/models";

// ------------------------------------------------------

const ArticleStatusFilterButton = ({ t, status }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const setStatus = (newStatus) => {
        navigate(
            updateLinkToArticlesPage(location, {
                pageNumber: 1,
                status: newStatus,
            })
        );
    };

    const items = [
        {
            icon: <FaStarOfLife />,
            label: t("pages.filters.all"),
            onClick: () => setStatus(EditingStatus.All),
            key: EditingStatus.All
        },
        {
            icon: <FaFile />,
            label: t("pages.filters.availableToType"),
            onClick: () => setStatus(EditingStatus.Available),
            key: EditingStatus.Available
        },
        {
            icon: <FaFileSignature />,
            label: t("pages.filters.typing"),
            onClick: () => setStatus(EditingStatus.Typing),
            key: EditingStatus.Typing
        },
        {
            icon: <FaFileAlt />,
            label: t("pages.filters.typed"),
            onClick: () => setStatus(EditingStatus.Typed),
            key: EditingStatus.Typed
        },
        {
            icon: <FaGlasses />,
            label: t("pages.filters.proofreading"),
            onClick: () => setStatus(EditingStatus.InReview),
            key: EditingStatus.InReview
        },
        {
            icon: <FaCheck />,
            label: t("pages.filters.completed"),
            onClick: () => setStatus(EditingStatus.Completed),
            key: EditingStatus.Completed
        },
    ];
    return (
        <Dropdown menu={{ items, selectedKeys: status ?? EditingStatus.All }}>
            <Button size="medium">
                <Space>
                    <FaChevronDown style={{ fontSize: "0.5em" }} />
                    <FaFilter />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default ArticleStatusFilterButton;
