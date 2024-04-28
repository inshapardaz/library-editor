import { ImBooks } from "react-icons/im";

// Local Imports
import IconText from "~/src/components/common/iconText";
// ------------------------------------------------------

export default BookSeriesInfo = ({ libraryId, book, t, navigate }) => {
    if (book && book.seriesName) {
        if (book.seriesIndex && book.seriesIndex > 0) {
            return <IconText icon={ImBooks}
                text={t("book.series.seriesAndIndexLabel", { name: book.seriesName, index: book.seriesIndex })}
                href={`/libraries/${libraryId}/books?series=${book.series.id}`} />

        } else {
            return <IconText icon={ImBooks}
                text={t("book.series.indexLabel", { name: book.seriesName })}
                href={`/libraries/${libraryId}/books?series=${book.series.id}`} />
        }
    }

    return null;
}
