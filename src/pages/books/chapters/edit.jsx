import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// UI Library Import
import { Alert, Box, Button, Center, Container, Grid, Group, LoadingOverlay, rem, Skeleton, Tooltip, useMantineTheme } from "@mantine/core";
import { notifications } from '@mantine/notifications';

// Local Imports
import { useGetBookQuery, useGetChapterQuery, useUpdateChapterMutation, useGetChapterContentsQuery } from '@/store/slices/books.api';
import { selectedLanguage } from "@/store/slices/uiSlice";

import {
    addChapterContent,
    updateChapterContent
} from '@/domain/book.service'
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd, IconLeft, IconRight, IconDone, IconChapters } from "@/components/icons";
import Error from '@/components/error';
import If from '@/components/if';
import { EditingStatus } from '@/models';
import Editor, { EditorFormat, DefaultConfiguration } from "@/components/editor";
import ChapterAssignButton from '@/components/books/chapters/chapterAssignButton';
import ChapterStatusButton from '@/components/books/chapters/chapterStatusButton';
import EditingStatusIcon from "@/components/editingStatusIcon";
//----------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);


const ChapterEditorPage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
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
    const isNewContent = useMemo(() => chapterContent && chapterContentError?.status === 404, [chapterContent, chapterContentError?.status]);

    useEffect(() => {
        console.log(chapterContent?.text)
        if (chapterContent?.text) {
            setContents(chapterContent.text);
        } else {
            setContents(null);
        }
    }, [chapterContent, chapterContentError, loadingChapterContent]);

    const onEditorSave = (content) => {
        if (isNewContent()) {
            setIsBusy(true)
            return addChapterContent({ chapter, language, payload: content })
                .then(() => notifications.show({
                    color: 'green',
                    title: t("book.actions.edit.success")
                }))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("book.actions.edit.error")
                }))
                .finally(() => setIsBusy(false));
        } else if (chapterContent) {
            setIsBusy(true)
            return updateChapterContent({ chapterContent, language, payload: content })
                .then(() => notifications.show({
                    color: 'green',
                    title: t("book.actions.add.success")
                }))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("book.actions.add.error")
                }))
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
                .then(() => notifications.show({
                    color: 'green',
                    title: t("chapter.actions.edit.success")
                }))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("chapter.actions.edit.error")
                }));
        }
    };

    // Render -----------------------------

    const showCompleteButton =
        chapter &&
        (chapter.status === EditingStatus.Typing ||
            chapter.status === EditingStatus.InReview);

    const actions = chapter ? <Group justify="flex-end" gap="xs" my="md">
        {showCompleteButton && (
            <Tooltip label={t("actions.done")}>
                <Button onClick={onComplete} variant="outline" color="green">
                    <IconDone />
                </Button>
            </Tooltip>
        )}
        {chapter && chapter.links.assign && (
            <ChapterAssignButton
                libraryId={libraryId}
                chapters={[chapter]}
                t={t}
                showDetails={false}
            />
        )}
        {chapter && chapter.links.update && (
            <ChapterStatusButton
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
    </Group> : null;

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    if (loadingBook || loadingChapter || loadingChapterContent) {
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

    if (errorLoadingBook || errorLoadingChapter) {
        return (<Container fluid mt="sm">
            <Error title={t('chapter.error.loading.title')}
                detail={t('chapter.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchChapter();
                }} />
        </Container>)
    }
    const title = chapter ? chapter.title : t('chapter.actions.add.title');
    const icon = <Center h={450}><IconChapters width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (<Container fluid mt="sm">
        <PageHeader title={title} defaultIcon={icon}
            subTitle={
                <Group visibleFrom='md'>
                    <EditingStatusIcon editingStatus={chapter.status} showText t={t} />
                </Group>
            }
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
                { title: book.title, href: `/libraries/${libraryId}/books/${bookId}`, icon: IconNames.Book },
                { title: t('book.chapters'), href: `/libraries/${libraryId}/books/${bookId}/chapters`, icon: IconNames.Chapters },
            ]}
            actions={actions}
        />
        <If condition={isNewContent}>
            <Alert variant="light" color="yellow" withCloseButton title={t('chapter.editor.newContents')} icon={<IconAdd />} />
        </If>
        <Box style={{ height: '100%', overflow: 'auto' }} >
            <LoadingOverlay visible={isBusy || isUpdatingChapter} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Editor defaultValue={contents}
                configuration={{
                    ...DefaultConfiguration,
                    richText: true,
                    format: EditorFormat.Markdown,
                    toolbar: {
                        ...DefaultConfiguration.toolbar,
                        showSave: true
                    }
                }}
                language={language}
                contentKey={`chapter-${libraryId}-${bookId}-${chapterNumber}`}
                onSave={onEditorSave} />
        </Box>
    </Container>
    );
}

export default ChapterEditorPage;