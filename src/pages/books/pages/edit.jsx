import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// UI library import
import { Box, Button, Container, Group, Loader, LoadingOverlay, Switch, Tooltip } from "@mantine/core";
import { useFullscreen, useLocalStorage } from "@mantine/hooks";

// Local imports
import {
    useGetBookQuery,
    useGetBookPageQuery,
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useUpdateBookPageImageMutation,
} from '@/store/slices/books.api';
import { selectedLanguage } from "@/store/slices/uiSlice";
import { EditingStatus } from '@/models';
import Error from '@/components/error';
import If from '@/components/if';
import PageHeader from "@/components/pageHeader";
import EditingStatusIcon from "@/components/editingStatusIcon";
import IconNames from '@/components/iconNames';
import { IconLeft, IconRight, IconDone, IconFullScreenExit, IconFullScreen, IconImage, IconNoImage } from "@/components/icons";
import Editor, { EditorFormat, DefaultConfiguration } from "@/components/editor";
import PageImage from "@/components/books/pages/pageImage";
import PageAssignButton from '@/components/books/pages/pageAssignButton';
import PageStatusButton from '@/components/books/pages/pageStatusButton';
import PageChapterButton from '@/components/books/pages/pageChapterButton';
import PageOcrButton from "@/components/books/pages/pageOcrButton";
import { error, success } from '@/utils/notifications';
import classes from './edit.module.css'
//-------------------------------

const BookPageEditPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, bookId, pageNumber } = useParams();
    const lang = useSelector(selectedLanguage);
    const navigate = useNavigate();
    const [contents, setContents] = useState('')
    const [isBusy, setIsBusy] = useState(false)
    const [image, setImage] = useState();
    const [showImge, setShowImage] = useLocalStorage({
        key: "page-editor-view-image",
        defaultValue: true
    });
    // Data operations
    const [addBookPage, { isLoading: isAddingPage }] = useAddBookPageMutation();
    const [updateBookPage, { isLoading: isUpdatingPage }] = useUpdateBookPageMutation();
    const [updateBookPageImage, { isLoading: isUpdatingImage }] = useUpdateBookPageImageMutation();

    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch: refetchBook
    } = useGetBookQuery({
        libraryId,
        bookId
    });

    const language = useMemo(() => book?.language ?? lang?.key ?? 'en', [book?.language, lang?.key]);

    const {
        currentData: page,
        error: pageError,
        isFetching: loadingPage,
        refetch: refetchPage
    } = useGetBookPageQuery(
        { libraryId, bookId, pageNumber, language },
        { skip: !book || !pageNumber || !language }
    );


    // ----------------------------------------
    const isNewContent = useMemo(() => page && pageError?.status === 404, [page, pageError?.status]);

    useEffect(() => {
        if (page?.text) {
            setContents(page.text);
        } else {
            setContents(null);
        }
    }, [page?.text]);

    const uploadImage = async (_page) => {
        if (image) {
            await updateBookPageImage({
                page: _page,
                payload: image,
            }).unwrap();
        }
    };

    const onEditorSave = (_content) => {
        if (isNewContent) {
            setIsBusy(true)
            let newPage = null;
            return addBookPage({
                libraryId,
                bookId,
                payload: {
                    bookId,
                    text: _content,
                },
            }).unwrap()
                .then(r => {
                    newPage = r
                    return uploadImage(r)
                })
                .then(() => setImage(null))
                .then(() => success({ message: t("page.actions.edit.success") }))
                .then(() => navigate(
                    `/libraries/${libraryId}/books/${bookId}/pages/${newPage.sequenceNumber}/edit`
                ))
                .catch(() => error({ message: t("page.actions.edit.error") }))
                .finally(() => setIsBusy(false));
        } else if (page) {
            setIsBusy(true)
            const payload = {
                bookId: page.bookId,
                chapterId: page.chapterId,
                reviewerAccountId: page.reviewerAccountId,
                reviewerAssignTimeStamp: page.reviewerAssignTimeStamp,
                sequenceNumber: page.sequenceNumber,
                status: page.status,
                text: _content,
                links: page.links,
            };
            return updateBookPage({ page: payload })
                .unwrap()
                .then(uploadImage)
                .then(() => setImage(null))
                .then(() => success({ message: t("page.actions.add.success") }))
                .catch(() => error({ message: t("page.actions.add.error") }))
                .finally(() => setIsBusy(false));
        }
    };

    const canComplete = useMemo(() => page && (page.status === EditingStatus.Typing || page.status === EditingStatus.InReview), [page]);

    const onComplete = () => {
        if (canComplete) {
            const payload = {
                ...page,
                status: page.status === EditingStatus.Typing ? EditingStatus.Typed : EditingStatus.Completed,
            };
            return updateBookPage({ page: payload })
                .unwrap()
                .then(() => success({ message: t("page.actions.edit.success") }))
                .catch(() => error({ message: t("page.actions.edit.error") }));
        }
    };

    //------------ Render ----------------------------
    const actions = page ? <Group justify="flex-end" gap="xs" mb="md">
        {canComplete && (
            <Tooltip label={t("actions.done")}>
                <Button onClick={onComplete} variant="outline" color="green">
                    <IconDone height={20} />
                </Button>
            </Tooltip>
        )}
        {page && page.links.assign && (
            <PageAssignButton
                type="default"
                libraryId={libraryId}
                pages={[page]}
                t={t}
                showDetails={false}
            />
        )}
        {page && page.links.update && (
            <PageChapterButton
                type="default"
                libraryId={libraryId}
                bookId={bookId}
                pages={[page]}
                t={t}
            />
        )}
        {page && page.links.update && (
            <PageStatusButton
                type="default"
                libraryId={libraryId}
                pages={[page]}
                t={t}
            />
        )}
        {page && page.links.update && (
            <PageOcrButton
                book={book}
                pages={[page]}
                t={t}
                type='default' />
        )}
        <Tooltip key="previous" label={t("page.editor.showImage")}>
            <Switch size="lg"
                color="gray"
                checked={showImge}
                onChange={(event) => setShowImage(event.currentTarget.checked)}
                onLabel={<IconImage height={16} stroke={2.5} />}
                offLabel={<IconNoImage height={16} stroke={2.5} />} />
        </Tooltip>
        <Button.Group>
            <Tooltip key="previous" label={t("actions.previous")}>
                <Button variant="default" disabled={!page || !page.links.previous} component={Link} data-disabled={!page || !page.links.previous}
                    onClick={(event) => !page || !page.links.previous ? event.preventDefault() : null}
                    to={`/libraries/${libraryId}/books/${bookId}/pages/${page.sequenceNumber - 1}/contents/edit`}>
                    {lang.isRtl ? <IconRight height={20} /> : <IconLeft height={20} />}
                </Button>
            </Tooltip>
            <Button variant="default">
                {page.sequenceNumber} / {book.pageCount}
            </Button>
            <Tooltip key="next" label={t("actions.next")}>
                <Button variant="default" disabled={!page || !page.links.next} component={Link} data-disabled={!page || !page.links.next}
                    onClick={(event) => !page || !page.links.next ? event.preventDefault() : null}
                    to={`/libraries/${libraryId}/books/${bookId}/pages/${page.sequenceNumber + 1}/contents/edit`}>
                    {lang.isRtl ? <IconLeft height={20} /> : <IconRight height={20} />}
                </Button>
            </Tooltip>
        </Button.Group>
        <Tooltip key="fullscreen" label={t(fullscreen ? "actions.fullscreenExit" : "actions.fullscreen")}>
            <Button variant="default" onClick={toggle} >
                {fullscreen ? <IconFullScreenExit height={20} /> : <IconFullScreen height={20} />}
            </Button>
        </Tooltip>
    </Group> : null;

    if (loadingBook || loadingPage) {
        return (
            <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <Loader />
            </div>
        );
    }

    if (errorLoadingBook) {
        return (<Container fluid mt="sm">
            <Error title={t('page.error.loading.title')}
                detail={t('page.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchPage();
                }} />
        </Container>)
    }
    const title = page ? page.sequenceNumber : t('page.actions.add.title');

    return (<Container fluid mt="sm" ref={ref} bg="var(--mantine-color-body)" >
        <LoadingOverlay visible={isBusy || isAddingPage || isUpdatingPage || isUpdatingImage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <PageHeader title={title} defaultIcon={IconNames.Pages}
            subTitle={
                <Group visibleFrom='md'>
                    <EditingStatusIcon editingStatus={page.status} showText t={t} />
                </Group>
            }
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
                { title: book.title, href: `/libraries/${libraryId}/books/${bookId}`, icon: IconNames.Book },
                { title: t('book.pages'), href: `/libraries/${libraryId}/books/${bookId}?section=pages`, icon: IconNames.Pages },
                { title: `${title}`, icon: IconNames.Page }
            ]}
            actions={actions}
        />
        <Box style={{ height: `calc(100vh - ${fullscreen ? '100px' : '160px'})`, overflow: 'auto', position: 'relative' }} bg="var(--mantine-color-body)" >
            <div className={classes.split}>
                <div className={showImge ? classes.left : classes.full}>
                    <Editor defaultValue={contents}
                        configuration={{
                            ...DefaultConfiguration,
                            richText: true,
                            format: EditorFormat.Markdown,
                            toolbar: {
                                ...DefaultConfiguration.toolbar,
                                showFontFormat: false,
                                showSave: true,
                                showZoom: true,
                                showViewFont: true,
                                showExtraFormat: false
                            },
                            spellchecker: {
                                enabled: true,
                                language: language,
                            },
                        }}
                        language={language}
                        contentKey={`page-${libraryId}-${bookId}-${pageNumber}`}
                        onSave={onEditorSave} />
                </div>
                <If condition={showImge}>
                    <div className={classes.drag}></div>
                    <div className={classes.right}>
                        <PageImage t={t} page={page} image={image} onChange={setImage} />
                    </div>
                </If>
            </div>
        </Box>
    </Container >);
}

export default BookPageEditPage;
