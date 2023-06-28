import { Typography } from "antd";
// ------------------------------------------------------

const { Text } = Typography;

// ------------------------------------------------------

export function BookSeriesInfo({ book, t }) {
    if (book && book.seriesName) {
        if (book.seriesIndex && book.seriesIndex > 0) {
            return <Text type="secondary">{t("book.series.seriesAndIndexLabel", { name: book.seriesName, index: book.seriesIndex })}</Text>;
        } else {
            return <Text type="secondary">{t("book.series.indexLabel", { name: book.seriesName })}</Text>;
        }
    }

    return null;
}
