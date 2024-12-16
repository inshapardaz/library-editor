import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// UI Library Imports
import { useMantineTheme, Stack, Button } from "@mantine/core";

// Local Imports
import {
    IconPublisher,
    IconLanguage,
    IconWorld,
    IconPages,
    IconCopyright,
    IconCalendar,
    IconReaderText,
    IconReaderImage
} from '@/components/icon';

import IconText from '@/components/iconText';
import If from '@/components/if';
import { Link } from 'react-router-dom';
//------------------------------------------------------

const BookInfo = ({ libraryId, book }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    if (!book) {
        return null;
    }

    return (<Stack>
        <If condition={book.yearPublished != null}>
            <IconText size="sm" icon={<IconCalendar height={24} style={{ color: theme.colors.dark[2] }} />} text={book.yearPublished} />
        </If>
        <If condition={book.publisher != null}>
            <IconText size="sm" icon={<IconPublisher height={24} style={{ color: theme.colors.dark[2] }} />} text={book.publisher} />
        </If>
        <If condition={book.language != null}>
            <IconText size="sm" icon={<IconLanguage height={24} style={{ color: theme.colors.dark[2] }} />} text={t(`languages.${book.language}`)} />
        </If>
        <If condition={book.isPublic != null}>
            <IconText size="sm" icon={<IconWorld height={24} style={{ color: theme.colors.dark[2] }} />} text={t("book.isPublic")} />
        </If>
        <If condition={book.copyrights != null}>
            <IconText size="sm" icon={<IconCopyright height={24} style={{ color: theme.colors.dark[2] }} />} text={t(`copyrights.${book.copyrights}`)} />
        </If>
        <If condition={book.pageCount != null}>
            <IconText size="sm" icon={<IconPages height={24} style={{ color: theme.colors.dark[2] }} />} text={t("book.pageCount", { count: book.pageCount })} />
        </If>

        <If condition={book.chapterCount > 0}>
            <Button fullWidth leftSection={<IconReaderText />} component={Link} to={`/libraries/${libraryId}/books/${book.id}/ebook`}>{t('book.actions.read.title')}</Button>
        </If>

        <If condition={book.pageCount > 0}>
            <Button fullWidth variant='outline' leftSection={<IconReaderImage />} component={Link} to={`/libraries/${libraryId}/books/${book.id}/read`}>{t('book.actions.read.title')}</Button>
        </If>

        {/* 
        `   // Add pdf reader
            <If condition={book?.contents != null && book.contents.length > 0}>
            <If condition={book.contents.length > 1} esleChildren={
                <Button fullWidth variant='outline' leftSection={<IconPages />} component={Link} to={`/libraries/${libraryId}/books/${book.id}/read`}>{t('book.actions.download.title')}</Button>
            }>
                <Button fullWidth variant='outline' leftSection={<IconPages />} component={Link} to={`/libraries/${libraryId}/books/${book.id}/read`}>{t('book.actions.download.title')}</Button>
            </If>
        </If> */}
    </Stack>);
};

BookInfo.propTypes = {
    libraryId: PropTypes.number,
    book: PropTypes.shape({
        id: PropTypes.number,
        publisher: PropTypes.string,
        yearPublished: PropTypes.number,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        contents: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            bookId: PropTypes.number,
            fileName: PropTypes.string,
            mimeType: PropTypes.string,
            language: PropTypes.string,
        }))
    })
};

export default BookInfo;