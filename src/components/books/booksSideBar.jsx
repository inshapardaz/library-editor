import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// 3rd party imports
import { Menu } from "antd";
import { FaTags, FaTag, FaRegHeart, FaBookOpen } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";

// Local Imports
import { useGetCategoriesQuery } from "../../features/api/categoriesSlice";
import { isLoggedIn } from "../../features/auth/authSlice";

// --------------------------------------

function BooksSideBar({ libraryId, selectedCategories, sortBy, sortDirection, favorites, read }) {
    const { t } = useTranslation();
    const isUserLoggedIn = useSelector(isLoggedIn);
    const { data: categories, error, isFetching } = useGetCategoriesQuery({ libraryId });

    let catItems =
        !error &&
        !isFetching &&
        categories &&
        categories.data &&
        categories.data.map((c) => ({
            label: <Link to={`/libraries/${libraryId}/books?categories=${c.id}`}>{c.name}</Link>,
            key: `side-bar-category-${c.id}`,
            icon: <FaTag />,
        }));

    const items = [
        {
            key: "sidebar-bar-latest",
            icon: <MdNewReleases />,
            label: <Link to={`/libraries/${libraryId}/books?sortBy=DateCreated&sortDirection=descending`}>{t("books.latest.title")}</Link>,
        },
        {
            type: "divider",
        },
        {
            key: "side-bar-categories",
            icon: <FaTags />,
            label: t("categories.title"),
            children: catItems,
            type: "group",
        },
    ];

    if (isUserLoggedIn) {
        items.splice(1, 0, {
            key: "sidebar-bar-favorites",
            icon: <FaRegHeart />,
            label: <Link to={`/libraries/${libraryId}/books?favorites=true`}>{t("books.favorites.title")}</Link>,
        });

        items.splice(2, 0, {
            key: "sidebar-bar-read",
            icon: <FaBookOpen />,
            label: <Link to={`/libraries/${libraryId}/books?read=true`}>{t("books.read.title")}</Link>,
        });

        items.splice(2, 0, {
            key: "sidebar-bar-reviewed",
            icon: <FaBookOpen />,
            label: <Link to={`/libraries/${libraryId}/books?status=proofRead`}>{t("books.ProofRead.title")}</Link>,
        });

        items.splice(2, 0, {
            key: "sidebar-bar-editing",
            icon: <FaBookOpen />,
            label: <Link to={`/libraries/${libraryId}/books?status=beingTyped`}>{t("books.BeingTyped.title")}</Link>,
        });
    }

    let selection = [];
    if (selectedCategories) {
        selection.push(`side-bar-category-${selectedCategories}`);
    } else if (sortBy && sortBy.toLowerCase() === "datecreated" && sortDirection && sortDirection.toLowerCase() === `descending`) {
        selection.push("sidebar-bar-latest");
    } else if (favorites) {
        selection.push("sidebar-bar-favorites");
    } else if (read) {
        selection.push("sidebar-bar-read");
    }

    return <Menu mode="inline" selectedKeys={selection} defaultOpenKeys={["side-bar-categories"]} style={{ height: "100%" }} items={items} />;
}

export default BooksSideBar;
