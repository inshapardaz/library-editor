import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

// UI library import
import { ActionIcon, Breadcrumbs, Button, Center, Container, Drawer, Group, Image, rem, Skeleton, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure, useFullscreen } from '@mantine/hooks';

// Local imports
import { languages } from '@/i18n';
import { useGetBookQuery, useGetBookChaptersQuery, useGetBookPageQuery } from '@/store/slices/books.api';
import TableOfContents from "@/components/reader/tableOfContents";
import ImageReader from "@/components/reader/pages/imageReader";
import Error from '@/components/error';
import { IconBook, IconChapters, IconFullScreen, IconFullScreenExit } from '@/components/icon';
import ReadModeToggle from "@/components/reader/readModeToggle";
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import ZoomControl from "@/components/reader/zoomControl";
import classes from './reader.module.css'
//------------------------------------------------------

const BookReaderPage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { ref, toggle, fullscreen } = useFullscreen();
    const [opened, { open, close }] = useDisclosure(false);
    const { libraryId, bookId } = useParams();
    const [searchParams] = useSearchParams();
    const selectedPageNumber = parseInt(searchParams.get("page") ?? "1", 10);
    const [zoom, setZoom] = useState(100);

    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch: refetchBook
    } = useGetBookQuery({
        libraryId,
        bookId
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

    const hasGotChapterContents = useMemo(() => chapters && chapters.data && chapters.data.length > 0 && chapters.data.some(x => x.contents.length > 0), [chapters]);

    const {
        data: page1,
        error: errorPage1,
        isFetching: loadingPage1,
        refetch: refrechPage1
    } = useGetBookPageQuery({
        libraryId,
        bookId,
        pageNumber: selectedPageNumber
    }, { skip: !libraryId || !bookId || !selectedPageNumber });

    const {
        data: page2,
        error: errorPage2,
        isFetching: loadingPage2,
        refetch: refrechPage2
    } = useGetBookPageQuery({
        libraryId,
        bookId,
        pageNumber: selectedPageNumber + 1
    }, { skip: !libraryId || !bookId || !selectedPageNumber || !page1?.links?.next });

    const movePrevious = ({ numberOfPages }) => {
        if (!loadingPage1 && !loadingPage2 &&
            !errorPage1 && !errorPage2 && selectedPageNumber > 1) {
            navigate(`/libraries/${libraryId}/books/${bookId}/read?page=${selectedPageNumber - numberOfPages}`)
        }
    }

    const moveNext = ({ numberOfPages }) => {
        if (!loadingPage1 && !loadingPage2 &&
            !errorPage1 && !errorPage2 &&
            numberOfPages == 2 ? page2?.links?.next != null : page1?.links?.next != null)
            navigate(`/libraries/${libraryId}/books/${bookId}/read?page=${selectedPageNumber + numberOfPages}`)
    }

    if (loadingBook || loadingChapters) {
        return (<Container fluid mt="sm">
            <Stack>
                {
                    Array(20).fill(1).map((e, index) => <Skeleton key={index} height={rem(8)} radius="md" />)
                }
            </Stack>
        </Container>);
    }


    if (errorLoadingBook || errorLoadingChapters) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchChapters();
                }} />
        </Container>)
    }

    const chapterLinks = chapters?.data.map(c => (
        { key: c.chapterNumber, label: c.title, firstPageIndex: c.firstPageIndex, order: 1, icon: (<IconChapters />) }
    ));

    const onChapterSelected = (chapter) => {
        if (chapter.firstPageIndex) {
            navigate(`/libraries/${libraryId}/books/${book.id}/read?page=${chapter.firstPageIndex}`)
        }
    }

    const onReadModeChanged = (newMode) => {
        if (newMode === 'text') {
            navigate(`/libraries/${libraryId}/books/${book.id}/ebook`)
        }
    }

    const items = [
        (<Button variant="transparent" color="gray" size="compact-sm" component={Link} to={`/libraries/${libraryId}/books/${book.id}`} leftSection={<IconBook />} key='book'>
            {book.title}
        </Button>),
        (<Button variant="transparent" color="gray" size="compact-sm" onClick={open} leftSection={<IconChapters />} key="chapter">
            {page1 ? page1.chapterTitle : t('book.chapters')}
        </Button>),
    ]
    const icon = <Center h={450}><IconBook width={250} style={{ color: theme.colors.dark[1] }} /></Center>;


    return (<Container fluid ref={ref} className={classes.reader}>
        <div className={classes.imageReaderHeader}>
            <Group justify="space-between">
                <Breadcrumbs>{items}</Breadcrumbs>
                <Group>
                    <ZoomControl value={zoom} onChange={setZoom} />
                    {hasGotChapterContents && <ReadModeToggle value='image' onChange={onReadModeChanged} />}
                    <ActionIcon onClick={toggle} size={36} variant="default">
                        {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
                    </ActionIcon>
                </Group>
            </Group>
        </div>
        <div className={classes.contents}>
            <ImageReader page1={page1}
                page2={page1?.links?.next ? page2 : null}
                pageNumber={Number(selectedPageNumber)}
                height={600}
                direction={book ? languages[book?.language].dir : 'rtl'}
                isLoading={loadingBook || loadingChapters}
                onNext={moveNext}
                zoom={zoom}
                onPrevious={movePrevious}
                onReload={() => {
                    refrechPage1()
                    refrechPage2()
                }} />
        </div>

        <Drawer opened={opened} onClose={close} title={<Group><IconChapters />{t('book.chapters')}</Group>}>
            <TableOfContents title={book?.title}
                image={book.links?.image ?
                    <Image
                        h={200}
                        w="auto"
                        fit="contain"
                        radius="sm"
                        src={book?.links?.image} /> :
                    icon
                }
                subTitle={<AuthorsAvatar libraryId={libraryId} authors={book?.authors} />}
                links={chapterLinks}
                onSelected={onChapterSelected}
                selectedKey={page1?.chapterNumber}
            />
        </Drawer>
    </Container>)
}

export default BookReaderPage;