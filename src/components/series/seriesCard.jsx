import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Card, Typography } from "antd";
import { FaEdit } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import styles from "../../styles/common.module.scss";
import { IconText } from "../common/iconText";
import helpers from "../../helpers/index";
import SeriesDeleteButton from "./seriesDeleteButton";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function SeriesCard({ libraryId, series, t }) {
    const cover = <img src={series.links.image || helpers.defaultSeriesImage} onError={helpers.setDefaultSeriesImage} className={styles["series__image"]} alt={series.name} />;
    const description = series.description ? (
        <Paragraph ellipsis type="secondary">
            {series.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("series.noDescription")}</Text>
    );
    const seriesCount = (
        <Link to={`/libraries/${libraryId}/series/${series.id}`}>
            <IconText icon={ImBooks} text={t("series.bookCount", { count: series.bookCount })} key="series-book-count" />
        </Link>
    );

    const editButton = (
        <Link to={`/libraries/${libraryId}/series/${series.id}/edit`}>
            <IconText icon={FaEdit} text={t("actions.edit")} key="series-edit" />
        </Link>
    );

    const deleteSeries = (<SeriesDeleteButton libraryId={libraryId} series={series} t={t} type="ghost" size="small" />);
    return (
        <Link to={`/libraries/${libraryId}/series/${series.id}`}>
            <Card key={series.id} cover={cover} hoverable actions={[editButton, deleteSeries, seriesCount]}>
                <Card.Meta title={series.name} description={description} />
            </Card>
        </Link>
    );
}

export default SeriesCard;
