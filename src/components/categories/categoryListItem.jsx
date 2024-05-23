import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List } from "antd";

// Local Imports
import { FaEdit, FaTags, ImBooks } from "/src/icons";
import IconText from "/src/components/common/iconText";
import CategoryDeleteButton from "./categoryDeleteButton";

// ------------------------------------------------------

const CategoryListItem = ({ libraryId, category, t }) => {
    const avatar = <FaTags />;
    const title = <Link to={`/libraries/${libraryId}/books?categories=${category.id}`}>{category.name}</Link>;
    const bookCount = (
        <IconText icon={ImBooks} text={t("category.bookCount", { count: category.bookCount })} key="category-book-count"
            href={`/libraries/${libraryId}/books?categories=${category.id}`} />
    );

    const editButton = (
        <IconText icon={FaEdit} text={t("actions.edit")} key="category-edit" href={`/libraries/${libraryId}/categories/${category.id}/edit`} />
    );

    const deleteCategory = <CategoryDeleteButton libraryId={libraryId} category={category} t={t} type="ghost" size="small" />;

    return (
        <List.Item key={category.id} actions={[bookCount, editButton, deleteCategory]}>
            <List.Item.Meta title={title} avatar={avatar} />
        </List.Item>
    );
};

export default CategoryListItem;
