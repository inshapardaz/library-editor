import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";
import { FaEdit } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import * as styles from "~/src/styles/common.module.scss";
import { seriesPlaceholderImage, setDefaultSeriesImage } from "~/src/util";
import IconText from "~/src/components/common/iconText";
import SeriesDeleteButton from "./seriesDeleteButton";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function SeriesListItem({ libraryId, series, t }) {
    const avatar = <img src={series.links.image || seriesPlaceholderImage}
        onError={setDefaultSeriesImage}
        className={styles["series__image--small"]}
        alt={series.name} />;
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

    const deleteSeries = <SeriesDeleteButton libraryId={libraryId} series={series} t={t} type="ghost" size="small" />;

    return (
        <List.Item key={series.id} actions={[bookCount, editButton, deleteSeries]}>
            <List.Item.Meta title={title} avatar={avatar} description={description} />
        </List.Item>
    );
}

export default SeriesListItem;
