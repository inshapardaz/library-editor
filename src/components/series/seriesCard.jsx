import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Card, Typography } from "antd";
import { FaEdit } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import "./styles.scss";
import { seriesPlaceholderImage, setDefaultSeriesImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import SeriesDeleteButton from "./seriesDeleteButton";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const SeriesCard = ({ libraryId, series, t }) => {
    const cover = <img src={series.links.image || seriesPlaceholderImage} onError={setDefaultSeriesImage} className="series__image" alt={series.name} />;
    const description = series.description ? (
        <Paragraph ellipsis type="secondary">
            {series.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("series.noDescription")}</Text>
    );
    const seriesCount = (
        <IconText icon={ImBooks} href={`/libraries/${libraryId}/series/${series.id}`}
            text={series.bookCount} key="series-book-count" />
    );

    const editButton = (
        <IconText icon={FaEdit} key="series-edit"
            href={`/libraries/${libraryId}/series/${series.id}/edit`} />
    );

    const deleteSeries = (<SeriesDeleteButton libraryId={libraryId} series={series} t={t} type="ghost" size="small" />);
    return (
        <Card key={series.id} cover={cover} hoverable actions={[editButton, deleteSeries, seriesCount]}>
            <Link to={`/libraries/${libraryId}/series/${series.id}`}>
                <Card.Meta title={series.name} description={description} />
            </Link>
        </Card>
    );
}

export default SeriesCard;
