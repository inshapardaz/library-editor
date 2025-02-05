import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Ui library Imports
import { Alert, Box, Button, Container, Divider, Group, LoadingOverlay, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";

// Local Imports
import {
    useGetIssueArticleQuery,
    useGetIssueArticleContentQuery,
    useUpdateIssueArticleMutation,
} from "@/store/slices/issueArticles.api";

import { useGetPeriodicalByIdQuery } from '@/store/slices/periodicals.api';
import { useGetIssueQuery } from "@/store/slices/issues.api";
import {
    addIssueArticleContent,
    updateIssueArticleContent
} from '@/domain/book.service'

import { selectedLanguage } from '@/store/slices/uiSlice';
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd, IconFullScreenExit, IconFullScreen, IconDone, IconRight, IconLeft } from "@/components/icons";
import Error from '@/components/error';
import If from '@/components/if';
import { EditingStatus } from '@/models';
import EditingStatusIcon from "@/components/editingStatusIcon";
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import Editor, { EditorFormat, DefaultConfiguration } from "@/components/editor";
import { error, success } from '@/utils/notifications';
//------------------------------------------
const getLanguage = (article, language) => {
    if (language) {
        if (article && article.contents) {
            var foundContent = article.contents.find(d => d.language === language);
            if (foundContent?.language) {
                return foundContent?.language;
            }
        }

        return language;
    }

    return 'ur';
}

//------------------------------------------
const IssueArticleContentEditPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber } = useParams();
    const [searchParams] = useSearchParams();
    const langParameter = searchParams.get("language");
    const lang = useSelector(selectedLanguage)
    const [isSaving, setIsSaving] = useState(false)
    const [contents, setContents] = useState('')

    const [update, { isLoading: isUpdating }] = useUpdateIssueArticleMutation();

    const {
        data: periodical,
        isError: isPeriodicalError,
        isFetching: isLoadingPeriodical,
    } = useGetPeriodicalByIdQuery({
        libraryId,
        periodicalId
    });

    const {
        refetch: refreshIssue,
        data: issue,
        isError: isErrorLoadingIssue,
        isFetching: isLoadingIssue,
    } = useGetIssueQuery({
        libraryId, periodicalId, volumeNumber, issueNumber
    }, { skip: isPeriodicalError });

    const {
        refetch,
        data: article,
        isError: isErrorLoadingArticle,
        isFetching: isLoadingArticle,
    } = useGetIssueArticleQuery({
        libraryId, periodicalId, volumeNumber, issueNumber, articleNumber
    }, { skip: isErrorLoadingIssue });

    const language = useMemo(() => getLanguage(article, langParameter), [article, langParameter])
    const {
        refetch: refetchContent,
        currentData: articleContent,
        error: articleContentError,
        isError: isErrorLoadingContent,
        isFetching: isLoadingContent,
    } = useGetIssueArticleContentQuery({
        libraryId, periodicalId, volumeNumber, issueNumber, articleNumber, language: language
    }, {
        skip: isLoadingArticle || isErrorLoadingArticle || !libraryId || !articleNumber || !language
    });

    const showCompleteButton =
        article &&
        (article.status === EditingStatus.Typing ||
            article.status === EditingStatus.InReview);


    useEffect(() => {
        if (articleContent?.text) {
            setContents(articleContent.text);
        } else {
            setContents(null);
        }
    }, [articleContent]);

    const onEditorSave = (content) => {
        if (isNewContent) {
            setIsSaving(true)
            return addIssueArticleContent({ article, language, payload: content })
                .then(refetchContent)
                .then(() => success({ message: t("writing.actions.edit.success") }))
                .catch(() => error({ message: t("writing.actions.edit.error") }))
                .finally(() => setIsSaving(false));
        } else if (articleContent) {
            setIsSaving(true)
            return updateIssueArticleContent({ articleContent, language, payload: content })
                .then(() => success({ message: t("writing.actions.add.success") }))
                .catch(() => error({ message: t("writing.actions.add.error") }))
                .finally(() => setIsSaving(false));
        }
    };

    const onComplete = () => {
        if (article.status === EditingStatus.Typing || article.status === EditingStatus.InReview) {
            const payload = {
                ...article,
                status: article.status === EditingStatus.Typing ? EditingStatus.Typed : EditingStatus.Completed,
            };
            return update({ url: article.links.update, payload })
                .unwrap()
                .then(() => success({ message: t("writing.actions.edit.success") }))
                .catch((e) => {
                    console.error(e)
                    return error({ message: t("writing.actions.edit.error") });
                });
        }
    };

    const isNewContent = useMemo(() => article && articleContentError?.status === 404, [article, articleContentError?.status]);

    if (isPeriodicalError || isErrorLoadingIssue || isErrorLoadingArticle || (!isNewContent && isErrorLoadingContent)) {
        return (<Container fluid mt="sm">
            <Error title={t('writing.error.loading.title')}
                detail={t('writing.error.loading.detail')}
                onRetry={() => { refreshIssue() && refetch() && refetchContent() }} />
        </Container>)
    }

    const title = article?.title;
    const actions = article ? <Group justify="flex-end" gap="xs" mb="md">
        {showCompleteButton && (
            <Tooltip label={t("actions.done")}>
                <Button onClick={onComplete} variant="outline" color="green">
                    <IconDone />
                </Button>
            </Tooltip>
        )}
        <Tooltip key="previous" label={t("actions.previous")}>
            <Button variant="default" disabled={!article || !article.links.previous} component={Link}
                to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber - 1}/contents/edit`}>
                {lang.isRtl ? <IconRight /> : <IconLeft />}
            </Button>
        </Tooltip>
        <Tooltip key="next" label={t("actions.next")}>
            <Button variant="default" disabled={!article || !article.links.next} component={Link}
                to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber + 1}/contents/edit`}>
                {lang.isRtl ? <IconLeft /> : <IconRight />}
            </Button>
        </Tooltip>

        <Tooltip key="fullscreen" label={t(fullscreen ? "actions.fullscreenExit" : "actions.fullscreen")}>
            <Button variant="default" onClick={toggle} >
                {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
            </Button>
        </Tooltip>
    </Group> : null;

    return (<Container fluid mt="sm" bg="var(--mantine-color-body)" ref={ref}>
        <PageHeader title={title} defaultIcon={IconNames.Chapters}
            subTitle={
                <Group visibleFrom='md'>
                    <EditingStatusIcon editingStatus={article?.status} showText t={t} />
                    <Divider orientation="vertical" />
                    <AuthorsAvatar libraryId={libraryId} authors={article?.authors ?? []} />
                </Group>
            }
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.periodicals'), href: `/libraries/${libraryId}/periodicals`, icon: IconNames.Periodicals },
                { title: periodical?.title, href: `/libraries/${libraryId}/periodicals/${periodicalId}`, icon: IconNames.Periodical },
                { title: t('issue.volumeNumber.title', { volumeNumber: issue?.volumeNumber }), href: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}`, icon: IconNames.VolumeNumber },
                { title: t('issue.issueNumber.title', { issueNumber: issue?.issueNumber }), href: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`, icon: IconNames.IssueNumber },
                { title: article?.title, icon: IconNames.IssueArticle },
            ]}
            actions={actions}
        />
        <If condition={isNewContent}>
            <Alert variant="light" color="yellow" withCloseButton title={t('writing.editor.newContents')} icon={<IconAdd />} />
        </If>
        <Box style={{ height: '100%', overflow: 'auto' }} >
            <LoadingOverlay visible={isLoadingPeriodical || isLoadingIssue || isLoadingArticle || isLoadingContent || isUpdating || isSaving} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div style={{ height: `calc(100vh - ${fullscreen ? '160px' : '220px'})`, position: 'relative' }}>
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
                    contentKey={`article-${libraryId}-${periodicalId}-${volumeNumber}-${issueNumber}-${articleNumber}-${language}`}
                    onSave={onEditorSave} />
            </div>
        </Box>
    </Container>);
}

export default IssueArticleContentEditPage;