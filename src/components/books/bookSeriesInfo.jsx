import React from 'react';

// Third party import

// Local Imports
import { ImBooks } from "/src/icons";
import IconText from "/src/components/common/iconText";
// ------------------------------------------------------
const BookSeriesInfo = ({ libraryId, book, t }) => {
    if (book && book.seriesName) {
        if (book.seriesIndex && book.seriesIndex > 0) {
            return <IconText icon={ImBooks}
                text={t("book.series.seriesAndIndexLabel", { name: book.seriesName, index: book.seriesIndex })}
                href={`/libraries/${libraryId}/books?series=${book.series?.id}`} />

        } else {
            return <IconText icon={ImBooks}
                text={t("book.series.indexLabel", { name: book.seriesName })}
                href={`/libraries/${libraryId}/books?series=${book.seriesId}`} />
        }
    }

    return null;
};

export default BookSeriesInfo;
