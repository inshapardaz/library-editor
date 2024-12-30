import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// UI library import
import { ActionIcon, Button, Breadcrumbs, Container, Drawer, Group, rem, Skeleton, Stack, Center, useMantineTheme, Image } from "@mantine/core";
import { useDisclosure, useFullscreen } from '@mantine/hooks';

// Local imports
import { useGetBookQuery, useGetChapterQuery, useGetBookChaptersQuery, useGetChapterContentsQuery } from '@/store/slices/books.api';
import TableOfContents from "@/components/reader/tableOfContents";
import MarkdownReader from "@/components/reader/ebook/markdownReader";
import ReaderSetting from "@/components/reader/ebook/readerSettings";
import Error from '@/components/error';
import { IconBook, IconChapters, IconFullScreen, IconFullScreenExit, IconSettings } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import classes from './ebookReader.module.css'
import ReadModeToggle from "@/components/reader/readModeToggle";
//------------------------------------------------------

const EBookReaderPage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const readerTheme = useSelector(state => state.ui.readerTheme);
    const readerView = useSelector(state => state.ui.readerView);
    const { ref, toggle, fullscreen } = useFullscreen();
    const [opened, { open, close }] = useDisclosure(false);
    const [settingsOpened, { open: openSetings, close: closeSettings }] = useDisclosure(false);
    const { libraryId, bookId } = useParams();
    const [searchParams] = useSearchParams();
    const selectedChapterNumber = searchParams.get("chapter") ?? 1;

    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch: refetchBook
    } = useGetBookQuery({
        libraryId,
        bookId
    });

    const selectedLanguage = useMemo(() => book?.language ?? "ur", [book]);
    const hasGotPages = useMemo(() => book && book.pageCount > 0 && book.links.pages, [book]);

    const {
        data: chapter,
        error: errorLoadingChapter,
        isFetching: loadingChapter,
        refetch: refetchChapter
    } = useGetChapterQuery({
        libraryId,
        bookId,
        chapterNumber: selectedChapterNumber
    }, {
        skip: loadingBook || errorLoadingBook || !libraryId || book === null || book?.id === null || selectedChapterNumber == null
    });

    const {
        data: chapterContent,
        error: errorLoadingContent,
        isFetching: loadingContent,
        refetch: refetchContent
    } = useGetChapterContentsQuery({
        libraryId,
        bookId,
        chapterNumber: selectedChapterNumber,
        language: selectedLanguage
    }, {
        skip: loadingBook || errorLoadingBook || loadingChapter || errorLoadingChapter || !libraryId || book === null || book?.id === null || selectedChapterNumber == null || !selectedLanguage
    });

    const {
        data: chapters,
        error: errorLoadingChapters,
        isFetching: loadingChapters,
        refetch: refetchChapters
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book?.id
    }, { skip: loadingBook || errorLoadingBook || !libraryId || book === null || book?.id === null });

    if (loadingBook || loadingChapters || loadingChapter || loadingContent) {
        return (<Container fluid mt="sm">
            <Stack>
                {
                    Array(20).fill(1).map((e, index) => <Skeleton key={index} height={rem(24)} radius="md" />)
                }
            </Stack>
        </Container>);
    }

    if (errorLoadingBook || errorLoadingChapters || errorLoadingChapter || errorLoadingContent) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchChapter();
                    refetchChapters();
                    refetchContent();
                }} />
        </Container>)
    }

    const chapterLinks = chapters?.data.map(c => (
        { key: c.chapterNumber, label: c.title, order: 1, icon: (<IconChapters />) }
    ));

    const onChapterSelected = (item) => {
        navigate(`/libraries/${libraryId}/books/${book.id}/ebook?chapter=${item.key}`)
    }

    const onReadModeChanged = (newMode) => {
        if (newMode === 'image') {
            navigate(`/libraries/${libraryId}/books/${book.id}/read`)
        }
    }

    const items = [
        (<Button variant="transparent" color="gray" size="compact-sm" component={Link} to={`/libraries/${libraryId}/books/${book.id}`} leftSection={<IconBook />} key='book'>
            {book.title}
        </Button>),
        (<Button variant="transparent" color="gray" size="compact-sm" onClick={open} leftSection={<IconChapters />} key="chapter">
            {chapter ? chapter.title : t('book.chapters')}
        </Button>),
    ]

    const icon = <Center h={450}><IconBook width={150} height={200} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (<Container fluid ref={ref} className={`${classes.reader} markdownReaderTheme--${readerTheme}`}>
        <Group justify="space-between" wrap="nowrap">
            <Breadcrumbs>{items}</Breadcrumbs>
            <Group wrap="nowrap">
                <ActionIcon onClick={openSetings} size={36} variant="default">
                    <IconSettings />
                </ActionIcon>
                {hasGotPages && <ReadModeToggle value='text' onChange={onReadModeChanged} />}
                <ActionIcon onClick={toggle} size={36} variant="default">
                    {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
                </ActionIcon>
            </Group>
        </Group>
        <MarkdownReader
            markdown={chapterContent?.text}
            viewType={readerView}
            title={book?.title}
            subTitle={chapter?.title}
            canGoNext={chapter?.links?.next != null}
            canGoPrevious={chapter?.links?.previous != null}
            onNext={() => navigate(`/libraries/${libraryId}/books/${book.id}/ebook?chapter=${chapter.chapterNumber + 1}`)}
            onPrevious={() => navigate(`/libraries/${libraryId}/books/${book.id}/ebook?chapter=${chapter.chapterNumber - 1}`)} />
        <ReaderSetting opened={settingsOpened} onClose={closeSettings} language={selectedLanguage} />
        <Drawer opened={opened} onClose={close} title={<Group><IconChapters />{t('book.chapters')}</Group>}>
            <TableOfContents title={book?.title}
                image={book.links?.image && !imgError ?
                    <Image
                        h={200}
                        w="auto"
                        fit="contain"
                        radius="sm"
                        src={book?.links?.image}
                        onError={() => setImgError(true)} /> :
                    icon
                }
                subTitle={<AuthorsAvatar libraryId={libraryId} authors={book?.authors} />}
                links={chapterLinks}
                selectedKey={selectedChapterNumber}
                onSelected={onChapterSelected} />
        </Drawer>
    </Container>)
}

export default EBookReaderPage;