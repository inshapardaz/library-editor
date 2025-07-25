import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// UI Library Import
import { Alert, Box, Button, Container, Grid, Group, LoadingOverlay, rem, Skeleton, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";

// Local Imports
import { useGetBookQuery, useGetBookChaptersQuery, useGetChapterQuery, useUpdateChapterMutation, useGetChapterContentsQuery } from '@/store/slices/books.api';
import { selectedLanguage } from "@/store/slices/uiSlice";

import {
    addChapterContent,
    updateChapterContent
} from '@/domain/book.service'
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd, IconLeft, IconRight, IconDone, IconFullScreenExit, IconFullScreen } from "@/components/icons";
import Error from '@/components/error';
import If from '@/components/if';
import { EditingStatus } from '@/models';
import Editor, { EditorFormat, DefaultConfiguration } from "@/components/editor";
import ChapterAssignButton from '@/components/books/chapters/chapterAssignButton';
import ChapterStatusButton from '@/components/books/chapters/chapterStatusButton';
import { error, success } from '@/utils/notifications';
//----------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const ChapterEditorPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, bookId, chapterNumber } = useParams();
    const lang = useSelector(selectedLanguage)
    const [contents, setContents] = useState('')
    const [isBusy, setIsBusy] = useState(false)

    // Data operations
    const [updateChapter, { isLoading: isUpdatingChapter }] = useUpdateChapterMutation();

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
    }, { skip: loadingBook || !libraryId || book === null || book?.id === null });

    const {
        data: chapter,
        error: errorLoadingChapter,
        isFetching: loadingChapter,
        refetch: refetchChapter
    } = useGetChapterQuery({
        libraryId,
        bookId,
        chapterNumber
    }, {
        skip: !chapterNumber
    });

    const language = book?.language ?? lang?.key ?? 'en';

    const {
        currentData: chapterContent,
        error: chapterContentError,
        isFetching: loadingChapterContent,
    } = useGetChapterContentsQuery(
        { libraryId, bookId, chapterNumber, language },
        { skip: !book || !chapter || !language }
    );

    // ----------------------------------------

    const isNewContent = useMemo(() => !chapterContent && chapterContentError?.status === 404, [chapterContent, chapterContentError?.status]);

    useEffect(() => {
        if (chapterContent?.text) {
            setContents(chapterContent.text);
        } else {
            setContents(null);
        }
    }, [chapterContent, chapterContentError, loadingChapterContent]);

    const onEditorSave = (content) => {
        if (isNewContent) {
            setIsBusy(true)
            return addChapterContent({ chapter, language, payload: content })
                .then(() => success({ message: t("chapter.actions.add.success") }))
                .catch(() => error({ message: t("chapter.actions.add.error") }))
                .finally(() => setIsBusy(false));
        } else if (chapterContent) {
            setIsBusy(true)
            return updateChapterContent({ chapterContent, language, payload: content })
                .then(() => success({ message: t("chapter.actions.edit.success") }))
                .catch(() => error({ message: t("chapter.actions.edit.error") }))
                .finally(() => setIsBusy(false));
        }
    };

    const onComplete = () => {
        if (chapter.status === EditingStatus.Typing || chapter.status === EditingStatus.InReview) {
            const payload = {
                ...chapter,
                status: chapter.status === EditingStatus.Typing ? EditingStatus.Typed : EditingStatus.Completed,
            };
            return updateChapter({ chapter: payload })
                .unwrap()
                .then(() => success({ message: t("chapter.actions.edit.success") }))
                .catch(() => error({ message: t("chapter.actions.edit.error") }));
        }
    };

    // Render -----------------------------

    const showCompleteButton =
        chapter &&
        (chapter.status === EditingStatus.Typing ||
            chapter.status === EditingStatus.InReview);

    const actions = chapter ? <Group justify="flex-end" gap="xs" mb="md">
        {showCompleteButton && (
            <Tooltip label={t("actions.done")}>
                <Button onClick={onComplete} variant="outline" color="green">
                    <IconDone />
                </Button>
            </Tooltip>
        )}
        {chapter && chapter.links.assign && (
            <ChapterAssignButton
                type="default"
                libraryId={libraryId}
                chapters={[chapter]}
                t={t}
                showDetails={false}
            />
        )}
        {chapter && chapter.links.update && (
            <ChapterStatusButton
                type="default"
                libraryId={libraryId}
                chapters={[chapter]}
                t={t}
            />
        )}
        <Tooltip key="previous" label={t("actions.previous")}>
            <Button variant="default" disabled={!chapter || !chapter.links.previous} component={Link}
                to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber - 1}/contents/edit`}>
                {lang.isRtl ? <IconRight /> : <IconLeft />}
            </Button>
        </Tooltip>
        <Tooltip key="next" label={t("actions.next")}>
            <Button variant="default" disabled={!chapter || !chapter.links.next} component={Link}
                to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber + 1}/contents/edit`}>
                {lang.isRtl ? <IconLeft /> : <IconRight />}
            </Button>
        </Tooltip>
        <Tooltip key="fullscreen" label={t(fullscreen ? "actions.fullscreenExit" : "actions.fullscreen")}>
            <Button variant="default" onClick={toggle} >
                {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
            </Button>
        </Tooltip>
    </Group> : null;

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    if (loadingBook || loadingChapters || loadingChapter || loadingChapterContent) {
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

    if (errorLoadingBook || errorLoadingChapters || errorLoadingChapter) {
        return (<Container fluid mt="sm">
            <Error title={t('chapter.error.loading.title')}
                detail={t('chapter.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchChapters();
                    refetchChapter();
                }} />
        </Container>)
    }

    return (<Container fluid mt="sm" bg="var(--mantine-color-body)" ref={ref}>
        <PageHeader
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
                { title: book.title, href: `/libraries/${libraryId}/books/${bookId}`, icon: IconNames.Book },
                { title: t('book.chapters'), href: `/libraries/${libraryId}/books/${bookId}?section=chapters`, icon: IconNames.Chapters },
                {
                    title: chapter?.title, icon: IconNames.Chapters, items: chapters?.data?.map(c => ({
                        title: c.title,
                        href: `/libraries/${libraryId}/books/${bookId}/chapters/${c.chapterNumber}/contents/edit`,
                        icon: IconNames.Chapters,
                        selected: c.chapterNumber == chapterNumber
                    }))
                },
            ]}
            actions={actions}
        />
        <If condition={isNewContent}>
            <Alert variant="light" color="yellow" withCloseButton title={t('chapter.editor.newContents')} icon={<IconAdd />} />
        </If>
        <Box style={{ height: '100%', overflow: 'auto' }} >
            <LoadingOverlay visible={isBusy || isUpdatingChapter} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div style={{ height: `calc(100vh - ${fullscreen ? '80px' : '130px'})`, position: 'relative' }}>
                <Editor defaultValue={contents}
                    configuration={{
                        ...DefaultConfiguration,
                        richText: true,
                        format: EditorFormat.Markdown,
                        autocompleteEnabled: true,
                        toolbar: {
                            ...DefaultConfiguration.toolbar,
                            showFontFormat: false,
                            showSave: true,
                            showZoom: true,
                            showViewFont: true,
                            showExtraFormat: false,
                        },
                        spellchecker: {
                            enabled: true,
                            language: language,
                        },
                    }}
                    language={language}
                    contentKey={`chapter-${libraryId}-${bookId}-${chapterNumber}`}
                    onSave={onEditorSave} />
            </div>
        </Box>
    </Container>
    );
}

export default ChapterEditorPage;
