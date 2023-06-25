import React from "react";
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";
import { FaEdit } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import styles from "../../styles/common.module.scss";
import helpers from "../../helpers/index";
import { IconText } from "../common/iconText";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function SeriesListItem({ libraryId, series, t }) {
    const avatar = <img src={series.links.image || helpers.defaultSeriesImage} onError={helpers.setDefaultSeriesImage} className={styles["series__image--small"]} alt={series.title} />;
    const title = <Link to={`/libraries/${libraryId}/series/${series.id}`}>{series.name}</Link>;
    const description = series.description ? (
        <Paragraph ellipsis type="secondary">
            {series.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("series.noDescription")}</Text>
    );
    const bookCount = (
        <Link to={`/libraries/${libraryId}/series/${series.id}`}>
            <IconText icon={ImBooks} text={t("series.bookCount", { count: series.bookCount })} key="series-book-count" />
        </Link>
    );

    const editButton = (
        <Link to={`/libraries/${libraryId}/series/${series.id}/edit`}>
            <IconText icon={FaEdit} text={t("actions.edit")} key="series-edit" />
        </Link>
    );

    return (
        <List.Item key={series.id} actions={[bookCount, editButton]}>
            <List.Item.Meta title={title} avatar={avatar} description={description} />
        </List.Item>
    );
}

export default SeriesListItem;
