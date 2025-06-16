import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// UI library import
import { Box, Button, Container, Group, Loader, LoadingOverlay, Switch, Tooltip } from "@mantine/core";
import { useFullscreen, useLocalStorage } from "@mantine/hooks";

// Local imports
import {
    useGetIssueQuery,
    useGetIssuePageQuery,
    useAddIssuePageMutation,
    useUpdateIssuePageMutation,
    useUpdateIssuePageImageMutation
} from '@/store/slices/issues.api';
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
import IssuePageAssignButton from '@/components/periodicals/issues/pages/pageAssignButton';
import IssuePageStatusButton from '@/components/periodicals/issues/pages/pageStatusButton';
import IssuePageOcrButton from "@/components/periodicals/issues/pages/pageOcrButton";
import { error, success } from '@/utils/notifications';
import classes from './edit.module.css'
import IssuePageArticleButton from "@/components/periodicals/issues/pages/pageArticleButton";
//-------------------------------

const IssuePageEditPage = () => {
    const { t } = useTranslation();
    const { ref, toggle, fullscreen } = useFullscreen();
    const { libraryId, periodicalId, volumeNumber, issueNumber, pageNumber } = useParams();
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
    const [addPage, { isLoading: isAddingPage }] = useAddIssuePageMutation();
    const [updatePage, { isLoading: isUpdatingPage }] = useUpdateIssuePageMutation();
    const [updatePageImage, { isLoading: isUpdatingImage }] = useUpdateIssuePageImageMutation();

    const {
        data: issue,
        error: errorLoadingIssue,
        isFetching: loadingIssue,
        refetch: refetchIssue
    } = useGetIssueQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber
    });

    const language = useMemo(() => issue?.language ?? lang?.key ?? 'en', [issue?.language, lang?.key]);

    const {
        currentData: page,
        error: pageError,
        isFetching: loadingPage,
        refetch: refetchPage
    } = useGetIssuePageQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
        pageNumber
    },
        { skip: !issue || !pageNumber || !language }
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
            await updatePageImage({
                page: _page,
                payload: image,
            }).unwrap();
        }
    };

    const onEditorSave = (_content) => {
        if (isNewContent) {
            setIsBusy(true)
            let newPage = null;
            return addPage({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                pageNumber,
                payload: {
                    periodicalId,
                    volumeNumber,
                    issueNumber,
                    pageNumber,
                    text: _content,
                },
            }).unwrap()
                .then(r => {
                    newPage = r
                    return uploadImage(r)
                })
                .then(() => setImage(null))
                .then(() => success({ message: t("page.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issue.issueNumber}/pages/${newPage.sequenceNumber}/edit`))
                .catch(() => error({ message: t("page.actions.edit.error") }))
                .finally(() => setIsBusy(false));
        } else if (page) {
            setIsBusy(true)
            const payload = {
                ...page,
                text: _content,
            };
            return updatePage({ page: payload })
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
            return updatePage({ page: payload })
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
            <IssuePageAssignButton
                type="default"
                libraryId={libraryId}
                pages={[page]}
                t={t}
                showDetails={false}
            />
        )}
        {page && page.links.update && (
            <IssuePageArticleButton
                type="default"
                libraryId={libraryId}
                issue={issue}
                pages={[page]}
                t={t}
            />
        )}
        {page && page.links.update && (
            <IssuePageStatusButton
                type="default"
                libraryId={libraryId}
                pages={[page]}
                t={t}
            />
        )}
        {page && page.links.update && (
            <IssuePageOcrButton
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
                    to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${page.sequenceNumber - 1}/contents/edit`}>
                    {lang.isRtl ? <IconRight height={20} /> : <IconLeft height={20} />}
                </Button>
            </Tooltip>
            <Button variant="default">
                {page.sequenceNumber} / {issue.pageCount}
            </Button>
            <Tooltip key="next" label={t("actions.next")}>
                <Button variant="default" disabled={!page || !page.links.next} component={Link} data-disabled={!page || !page.links.next}
                    onClick={(event) => !page || !page.links.next ? event.preventDefault() : null}
                    to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${page.sequenceNumber + 1}/contents/edit`}>
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

    if (loadingIssue || loadingPage) {
        return (
            <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <Loader />
            </div>
        );
    }

    if (errorLoadingIssue) {
        return (<Container fluid mt="sm">
            <Error title={t('page.error.loading.title')}
                detail={t('page.error.loading.detail')}
                onRetry={() => {
                    refetchIssue();
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
                { title: t('header.periodicals'), href: `/libraries/${libraryId}/periodicals`, icon: IconNames.Periodicals },
                { title: issue.periodicalName, href: `/libraries/${libraryId}/periodicals/${periodicalId}`, icon: IconNames.Periodical },
                { title: t('issue.volumeNumber.title', { volumeNumber: issue?.volumeNumber }), href: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}`, icon: IconNames.VolumeNumber },
                { title: t('issue.issueNumber.title', { issueNumber: issue?.issueNumber }), href: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`, icon: IconNames.IssueNumber },
                { title: t('pages.title'), href: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}?section=pages`, icon: IconNames.Pages },
                { title: `${page.sequenceNumber}`, icon: IconNames.Pages },
                { title: t('actions.edit'), icon: IconNames.Edit },
            ]}
            actions={actions}
        />
        <Box style={{ height: `calc(100vh - ${fullscreen ? '160px' : '220px'})`, overflow: 'auto', position: 'relative' }} bg="var(--mantine-color-body)" >
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
                        contentKey={`page-${libraryId}-${issue.id}-${pageNumber}`}
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

export default IssuePageEditPage;
