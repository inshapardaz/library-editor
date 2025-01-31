import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Ui library Imports
import { Alert, Box, Button, Container, Divider, Group, LoadingOverlay, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";

// Local Imports
import {
    useGetArticleQuery,
    useGetArticleContentsQuery,
    useUpdateArticleMutation,
    useAddArticleContentsMutation,
    useUpdateArticleContentsMutation
} from "@/store/slices/articles.api";

import { languages } from '@/store/slices/uiSlice';
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd, IconFullScreenExit, IconFullScreen, IconDone } from "@/components/icons";
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
const WritingContentEditPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, articleId } = useParams();
    const [searchParams] = useSearchParams();
    const langParameter = searchParams.get("language");
    const [contents, setContents] = useState('')

    const [updateArticle, { isLoading: isUpdatingArticle }] = useUpdateArticleMutation();
    const [addArticleContents, { isLoading: isAddingArticleContents }] = useAddArticleContentsMutation();
    const [updateArticleContents, { isLoading: isUpdatingArticleContents }] = useUpdateArticleContentsMutation();

    const {
        refetch,
        data: article,
        isError: isErrorLoadingArticle,
        isFetching: isLoadingArticle,
    } = useGetArticleQuery({
        libraryId, articleId
    });

    const language = useMemo(() => getLanguage(article, langParameter), [article, langParameter])
    const {
        refetch: refetchContent,
        currentData: articleContent,
        error: articleContentError,
        isError: isErrorLoadingContent,
        isFetching: isLoadingContent,
    } = useGetArticleContentsQuery({
        libraryId,
        articleId,
        language: language
    }, {
        skip: isLoadingArticle || isErrorLoadingArticle || !libraryId || articleId === null || language == null
    });


    const showCompleteButton =
        article &&
        (article.status === EditingStatus.Typing ||
            article.status === EditingStatus.InReview);


    useEffect(() => {
        if (articleContent?.text) {
            setContents(articleContent.text);
        } else {
            console.log('clearing contents')
            setContents(null);
        }
    }, [articleContent]);

    const onEditorSave = (content) => {
        if (isNewContent) {
            return addArticleContents({ libraryId, articleId, language, layout: 'normal', payload: content })
                .then(refetchContent)
                .then(() => success({ message: t("writing.actions.edit.success") }))
                .catch(() => error({ message: t("writing.actions.edit.error") }));
        } else if (articleContent) {
            return updateArticleContents({ libraryId, articleId, language, layout: 'normal', payload: content })
                .then(() => success({ message: t("writing.actions.add.success") }))
                .catch(() => error({ message: t("writing.actions.add.error") }));
        }
    };

    const onComplete = () => {
        if (article.status === EditingStatus.Typing || article.status === EditingStatus.InReview) {
            const payload = {
                ...article,
                status: article.status === EditingStatus.Typing ? EditingStatus.Typed : EditingStatus.Completed,
            };
            return updateArticle({ chapter: payload })
                .unwrap()
                .then(() => success({ message: t("writing.actions.edit.success") }))
                .catch(() => error({ message: t("writing.actions.edit.error") }));
        }
    };

    const isNewContent = useMemo(() => article && articleContentError?.status === 404, [article, articleContentError?.status]);

    if (isErrorLoadingArticle || (!isNewContent && isErrorLoadingContent)) {
        return (<Container fluid mt="sm">
            <Error title={t('writing.error.loading.title')}
                detail={t('writing.error.loading.detail')}
                onRetry={() => { refetch() && refetchContent() }} />
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
        {/* {chapter && chapter.links.assign && (
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
        )} */}

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
                { title: t('header.writings'), href: `/libraries/${libraryId}/writings`, icon: IconNames.Writings },
                { title: article?.title, href: `/libraries/${libraryId}/writings/${article?.id}`, icon: IconNames.Writing },
                {
                    title: t(`languages.${language}`), icon: IconNames.Language, items: Object.values(languages).map(l => ({
                        key: `lang-${l.key}`,
                        title: t(`languages.${l.key}`),
                        href: `/libraries/${libraryId}/writings/${articleId}/contents/edit?language=${l.key}`,
                        icon: IconNames.Language,
                        selected: l.key == language
                    }))
                },
            ]}
            actions={actions}
        />
        <If condition={isNewContent}>
            <Alert variant="light" color="yellow" withCloseButton title={t('writing.editor.newContents')} icon={<IconAdd />} />
        </If>
        <Box style={{ height: '100%', overflow: 'auto' }} >
            <LoadingOverlay visible={isLoadingArticle || isLoadingContent || isUpdatingArticle || isAddingArticleContents || isUpdatingArticleContents} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                    contentKey={`article-${libraryId}-${articleId}-${language}`}
                    onSave={onEditorSave} />
            </div>
        </Box>
    </Container>);
}

export default WritingContentEditPage;