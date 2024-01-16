import { ImBooks } from "react-icons/im";

// Local Imports
import { IconText } from "../common/iconText";
// ------------------------------------------------------

export function BookSeriesInfo({ libraryId, book, t, navigate }) {
    if (book && book.seriesName) {
        if (book.seriesIndex && book.seriesIndex > 0) {
            return <IconText
                icon={ImBooks}
                text={t("book.series.seriesAndIndexLabel", { name: book.seriesName, index: book.seriesIndex })}
                onClick={() => navigate(`/libraries/${libraryId}/books?series=${book.series.id}`)}/>

            } else {
                return <IconText
                icon={ImBooks}
                text={t("book.series.indexLabel", { name: book.seriesName })}
                onClick={() => navigate(`/libraries/${libraryId}/books?series=${book.series.id}`)}/>
        }
    }

    return null;
}
