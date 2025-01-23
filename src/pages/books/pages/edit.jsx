import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// UI library import
import { Box, Button, Container, Grid, Group, LoadingOverlay, rem, Skeleton, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { notifications } from '@mantine/notifications';

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
import PageHeader from "@/components/pageHeader";
import EditingStatusIcon from "@/components/editingStatusIcon";
import IconNames from '@/components/iconNames';
import { IconLeft, IconRight, IconDone, IconFullScreenExit, IconFullScreen } from "@/components/icons";
import Editor, { EditorFormat, DefaultConfiguration } from "@/components/editor";
import PageImage from "@/components/books/pages/pageImage";
import PageAssignButton from '@/components/books/pages/pageAssignButton';
import PageStatusButton from '@/components/books/pages/pageStatusButton';
import PageOcrButton from "@/components/books/pages/pageOcrButton";
import classes from './edit.module.css'
//-------------------------------
const PRIMARY_COL_HEIGHT = rem(300);

const BookPageEditPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, bookId, pageNumber } = useParams();
    const lang = useSelector(selectedLanguage);
    const navigate = useNavigate();
    const [contents, setContents] = useState('')
    const [isBusy, setIsBusy] = useState(false)
    const [image, setImage] = useState();

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
                .then(() => notifications.show({
                    color: 'green',
                    title: t("page.actions.edit.success")
                }))
                .then(() => navigate(
                    `/libraries/${libraryId}/books/${bookId}/pages/${newPage.sequenceNumber}/edit`
                ))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("page.actions.edit.error")
                }))
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
                .then(() => notifications.show({
                    color: 'green',
                    title: t("page.actions.add.success")
                }))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("page.actions.add.error")
                }))
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
                .then(() => notifications.show({
                    color: 'green',
                    title: t("page.actions.edit.success")
                }))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("page.actions.edit.error")
                }));
        }
    };


    //------------ Render ----------------------------
    const actions = page ? <Group justify="flex-end" gap="xs" mb="md">
        {canComplete && (
            <Tooltip label={t("actions.done")}>
                <Button onClick={onComplete} variant="outline" color="green">
                    <IconDone />
                </Button>
            </Tooltip>
        )}
        {page && page.links.assign && (
            <PageAssignButton
                type="default"
                buttonSize="xs"
                libraryId={libraryId}
                pages={[page]}
                t={t}
                showDetails={false}
            />
        )}
        {page && page.links.update && (
            <PageStatusButton
                type="default"
                buttonSize="xs"
                libraryId={libraryId}
                pages={[page]}
                t={t}
            />
        )}
        {page && page.links.update && (
            <PageOcrButton
                buttonSize="xs"
                book={book}
                pages={[page]}
                t={t}
                type='default' />
        )}
        <Button.Group>
            <Tooltip key="previous" label={t("actions.previous")}>
                <Button variant="default" disabled={!page || !page.links.previous} component={Link}
                    to={`/libraries/${libraryId}/books/${bookId}/pages/${page.sequenceNumber - 1}/contents/edit`}>
                    {lang.isRtl ? <IconRight /> : <IconLeft />}
                </Button>
            </Tooltip>
            <Tooltip key="next" label={t("actions.next")}>
                <Button variant="default" disabled={!page || !page.links.next} component={Link}
                    to={`/libraries/${libraryId}/books/${bookId}/pages/${page.sequenceNumber + 1}/contents/edit`}>
                    {lang.isRtl ? <IconLeft /> : <IconRight />}
                </Button>
            </Tooltip>
        </Button.Group>
        <Tooltip key="fullscreen" label={t(fullscreen ? "actions.fullscreenExit" : "actions.fullscreen")}>
            <Button variant="default" onClick={toggle} >
                {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
            </Button>
        </Tooltip>
    </Group> : null;

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    if (loadingBook || loadingPage) {
        return (<Container fluid mt="sm">
            <Grid
                mih={50}
            >
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
            </Grid>
        </Container>);
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
        <Box style={{ height: `calc(100vh - ${fullscreen ? '130px' : '180px'})`, overflow: 'auto' }} bg="var(--mantine-color-body)" >
            <LoadingOverlay visible={isBusy || isAddingPage || isUpdatingPage || isUpdatingImage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div className={classes.split}>
                <div className={classes.left}>
                    <Editor defaultValue={contents}
                        configuration={{
                            ...DefaultConfiguration,
                            richText: true,
                            format: EditorFormat.Markdown,
                            toolbar: {
                                ...DefaultConfiguration.toolbar,
                                showSave: true,
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
                <div className={classes.drag}></div>
                <div className={classes.right}>
                    <PageImage t={t} page={page} image={image} onChange={setImage} />
                </div>
            </div>
        </Box>
    </Container >);
}

export default BookPageEditPage;