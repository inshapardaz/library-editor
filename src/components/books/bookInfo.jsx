import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';

// UI Library Imports
import { useMantineTheme, Stack, Button, Divider, Progress, Group, Text } from "@mantine/core";

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
} from '@/components/icons';

import IconText from '@/components/iconText';
import If from '@/components/if';
import PublishButton from './publishButton';
import { getBookStatusText, BookStatusIcon } from './bookStatusIcon';
import { getStatusColor } from '@/models/editingStatus';
import EditingStatusIcon from '@/components/editingStatusIcon';
import BookDeleteButton from './bookDeleteButton';

//------------------------------------------------------

const BookInfo = ({ libraryId, book }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useMantineTheme();

    if (!book) {
        return null;
    }

    return (<Stack>
        <IconText size="sm" icon={<BookStatusIcon status={book.status} height={24} style={{ color: theme.colors.dark[2] }} />} text={getBookStatusText({ status: book.status, t })} />

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

        <If condition={book.links.delete}>
            <BookDeleteButton type="button" fullWidth variant='outline' color="red" t={t} book={book} onDeleted={() => navigate(`/libraries/${libraryId}/books/`)} />
        </If>

        <If condition={book.pageCount > 0}>
            <PublishButton fullWidth variant='outline' color="green" libraryId={libraryId} book={book} />
        </If>

        <If condition={book && book.pageStatus && book.pageStatus.length > 0}>
            <Divider />
            <Text>{t('book.pagesStatus')}</Text>
            <Stack gap="sm">
                {book.pageStatus?.map(s =>
                (<Group key={s.status} component={Link} to={`/libraries/${libraryId}/books/${book.id}/?section=pages&status=${s.status}`}>
                    <EditingStatusIcon editingStatus={s.status} t={t} style={{ color: theme.colors.dark[2] }} />
                    <Progress size="lg" value={s.percentage} color={getStatusColor(s.status)} style={{ flex: 1 }} />
                </Group>
                )
                )}
            </Stack>
        </If>
    </Stack>);
};

BookInfo.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        publisher: PropTypes.string,
        yearPublished: PropTypes.number,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        status: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        contents: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            bookId: PropTypes.number,
            fileName: PropTypes.string,
            mimeType: PropTypes.string,
            language: PropTypes.string,
        })),
        links: PropTypes.shape({
            delete: PropTypes.string,
        }),
        pageStatus: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.string,
            count: PropTypes.number,
            percentage: PropTypes.number,

        }))
    })
};

export default BookInfo;