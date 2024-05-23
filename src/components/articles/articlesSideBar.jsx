import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// 3rd party imports
import { Menu } from "antd";
import { FaTags, FaTag, FaRegHeart, FaEye, FaPen, FaPenAlt } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";

// Local Imports
import { useGetCategoriesQuery } from "/src/store/slices/categoriesSlice";
import { isLoggedIn } from "/src/store/slices/authSlice";

// --------------------------------------

const ArticlesSideBar = ({ libraryId, selectedCategories, sortBy, sortDirection, favorites, read }) => {
    const { t } = useTranslation();
    const isUserLoggedIn = useSelector(isLoggedIn);
    const { data: categories, error, isFetching } = useGetCategoriesQuery({ libraryId });

    let catItems =
        !error &&
        !isFetching &&
        categories &&
        categories.data &&
        categories.data.map((c) => ({
            label: <Link to={`/libraries/${libraryId}/articles?categories=${c.id}`}>{c.name}</Link>,
            key: `side-bar-category-${c.id}`,
            icon: <FaTag />,
        }));

    const items = [
        {
            key: "sidebar-bar-latest",
            icon: <MdNewReleases />,
            label: <Link to={`/libraries/${libraryId}/articles?sortBy=lastModified`}>{t("articles.latest.title")}</Link>,
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
            label: <Link to={`/libraries/${libraryId}/articles?favorite=true`}>{t("articles.favorites.title")}</Link>,
        });

        items.splice(2, 0, {
            key: "sidebar-bar-read",
            icon: <FaEye />,
            label: <Link to={`/libraries/${libraryId}/articles?read=true`}>{t("articles.read.title")}</Link>,
        });


        items.splice(2, 0, {
            key: "sidebar-bar-reviewed",
            icon: <FaPenAlt />,
            label: <Link to={`/libraries/${libraryId}/articles?status=inReview`}>{t("books.ProofRead.title")}</Link>,
        });

        items.splice(2, 0, {
            key: "sidebar-bar-editing",
            icon: <FaPen />,
            label: <Link to={`/libraries/${libraryId}/articles?status=typing`}>{t("books.BeingTyped.title")}</Link>,
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
};

export default ArticlesSideBar;
