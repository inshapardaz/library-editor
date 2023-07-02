import React from "react";
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List } from "antd";
import { FaEdit, FaTags } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import { IconText } from "../common/iconText";
import CategoryDeleteButton from "./categoryDeleteButton";

// ------------------------------------------------------

function CategoryListItem({ libraryId, category, t }) {
    const avatar = <FaTags />;
    const title = <Link to={`/libraries/${libraryId}/books?categories=${category.id}`}>{category.name}</Link>;
    const bookCount = (
        <Link to={`/libraries/${libraryId}/books?categories=${category.id}`}>
            <IconText icon={ImBooks} text={t("category.bookCount", { count: category.bookCount })} key="category-book-count" />
        </Link>
    );

    const editButton = (
        <Link to={`/libraries/${libraryId}/categories/${category.id}/edit`}>
            <IconText icon={FaEdit} text={t("actions.edit")} key="category-edit" />
        </Link>
    );

    const deleteCategory = <CategoryDeleteButton libraryId={libraryId} category={category} t={t} type="ghost" size="small" />;

    return (
        <List.Item key={category.id} actions={[bookCount, editButton, deleteCategory]}>
            <List.Item.Meta title={title} avatar={avatar} />
        </List.Item>
    );
}

export default CategoryListItem;
