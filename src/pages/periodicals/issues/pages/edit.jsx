import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import { useLocalStorage } from "usehooks-ts";
import { App, Button, Col, Row, Tooltip, Breadcrumb, Alert, Space } from "antd";
import {
    FaAngleLeft,
    FaAngleRight,
    FaBook,
    FaCheckCircle,
    FaHome,
    FaRegFileAlt,
    FaTimesCircle,
    ImNewspaper,
} from "/src/icons";
import {
    MdFullscreen,
    MdFullscreenExit,
    MdHideImage,
    MdImage,
} from "/src/icons";

// Local imports
import {
    useGetIssueQuery,
    useGetIssuePageQuery,
    useAddIssuePageMutation,
    useUpdateIssuePageMutation,
    useUpdateIssuePageImageMutation,
} from "/src/store/slices/issuesSlice";
import { selectedLanguage } from '/src/store/slices/uiSlice'
import { PageStatus } from "/src/models";
import PageHeader from "/src/components/layout/pageHeader";
import DataContainer from "/src/components/layout/dataContainer";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import PageOcrButton from "/src/components/books/pages/pageOcrButton";
import TextEditor from "/src/components/textEditor";
import PageAssignButton from "/src/components/books/pages/pageAssignButton";
import PageStatusButton from "/src/components/books/pages/pageStatusButton";
import PageImage from "/src/components/books/pages/pageImage";

// -----------------------------------------

const IssuePageEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage)

    const [fullScreen, setFullScreen] = useState(false);
    const [showImage, setShowImage] = useLocalStorage("issue-page-editor-show-image", true);
    const [fileList, setFileList] = useState();
    const [text, setText] = useState(null);
    const [contents, setContents] = useState('')
    const { libraryId, periodicalId, volumeNumber, issueNumber, pageNumber } = useParams();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [unsavedContent, setUnsavedContents] = useLocalStorage(`issue-page-${libraryId}-${periodicalId}-${volumeNumber}-${issueNumber}-${pageNumber}`);

    const { data: issue, error: issueError, isFetching: loadingIssue, } = useGetIssueQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber },
        { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber }
    );

    const { data: page, error, isFetching } = useGetIssuePageQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber, pageNumber },
        { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber || !pageNumber }
    );

    const language = issue?.language ?? lang?.key ?? 'en';
    const [addIssuePage, { isLoading: isAdding }] = useAddIssuePageMutation();
    const [updateIssuePage, { isLoading: isUpdating }] = useUpdateIssuePageMutation();
    const [updateIssuePageImage, { isLoading: isUpdatingImage }] = useUpdateIssuePageImageMutation();

    const uploadImage = useCallback((p) => {
        if (fileList && fileList[0]) {
            return updateIssuePageImage({
                page: p,
                payload: fileList[0],
            }).unwrap();
        }
        return Promise.resolve();
    }, [fileList, updateIssuePageImage]);

    useEffect(() => {
        setHasUnsavedChanges(localStorage.getItem(`issue-page-${libraryId}-${periodicalId}-${volumeNumber}-${issueNumber}-${pageNumber}`) != null);
    }, [pageNumber]);

    const onSave = useCallback((contents) => {
        if (page) {
            const payload = {
                periodicalId: page.periodicalId,
                volumeNumber: page.volumeNumber,
                issueNumber: page.issueNumber,
                reviewerAccountId: page.reviewerAccountId,
                reviewerAssignTimeStamp: page.reviewerAssignTimeStamp,
                sequenceNumber: page.sequenceNumber,
                status: page.status,
                text: contents,
                links: page.links,
            };
            return updateIssuePage({
                page: payload,
            })
                .unwrap()
                .then(uploadImage)
                .then(() => setUnsavedContents(null))
                .then(() => message.success(t("issue.pages.actions.edit.success")))
                .catch((e) => {
                    console.error(e);
                    message.error(t("issue.pages.actions.edit.error"))
                });
        } else {
            var newPage = null;
            return addIssuePage({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload: {
                    libraryId,
                    periodicalId,
                    volumeNumber,
                    issueNumber,
                    text: contents,
                },
            })
                .unwrap()
                .then(r => {
                    newPage = r;
                    return r;
                })
                .then(uploadImage)
                .then(() => navigate(
                    `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${newPage.sequenceNumber}/edit`
                ))
                .then(() => setUnsavedContents(null))
                .then(() => message.success(t("issue.pages.actions.add.success")))
                .catch((e) => {
                    console.error(e);
                    message.error(t("issue.pages.actions.add.error"))
                });
        }
    }, [addIssuePage, libraryId, periodicalId, volumeNumber, issueNumber, message, navigate, page, t, updateIssuePage, uploadImage]);

    useEffect(() => {
        setText(page?.text || null);
    }, [page]);


    const showCompleteButton =
        page &&
        (page.status === PageStatus.Typing ||
            page.status === PageStatus.InReview);

    const onComplete = () => {
        let newStatus = null;
        if (page.status === PageStatus.Typing) {
            newStatus = PageStatus.Typed;
        } else if (page.status === PageStatus.InReview) {
            newStatus = PageStatus.Completed;
        } else {
            return;
        }

        const payload = { ...page, status: newStatus };
        return updateIssuePage({ page: payload })
            .unwrap()
            .then(() => message.success(t("issue.pages.actions.edit.success")))
            .catch((e) => {
                console.error(e);
                message.error(t("issue.pages.actions.edit.error"))
            });
    };

    const onChange = (markdown) => {
        setUnsavedContents(markdown)
    }

    const onApplyUnsavedChanges = () => {
        if (unsavedContent) {
            setText(unsavedContent);
        }

        onClearUnsavedChanges();
    }

    const onClearUnsavedChanges = () => {
        setUnsavedContents(null);
        setHasUnsavedChanges(false);
    }

    const actions = [
        // <Button.Group key="complete-button">
        //     {showCompleteButton && (
        //         <Tooltip title={t("actions.done")}>
        //             <Button onClick={onComplete}>
        //                 <FaCheckCircle />
        //             </Button>
        //         </Tooltip>
        //     )}
        //     <PageOcrButton key="ocr-button" pages={[page]} t={t} />
        //     {page && page.links.assign && (
        //         <PageAssignButton
        //             key="assign-button"
        //             libraryId={libraryId}
        //             pages={[page]}
        //             t={t}
        //             showDetails={false}
        //         />
        //     )}
        //     {page && page.links.update && (
        //         <PageStatusButton
        //             key="status-button"
        //             libraryId={libraryId}
        //             pages={[page]}
        //             t={t}
        //         />
        //     )}
        // </Button.Group>,
    ];

    if (page && page.links && (page.links.previous || page.links.next)) {
        actions.push(
            <Button.Group>
                <Tooltip title={t("actions.previous")}>
                    <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${parseInt(pageNumber) - 1}/edit`}>
                        <Button disabled={!page || !page.links.previous}>
                            {lang.isRtl ? <FaAngleRight /> : <FaAngleLeft />}
                        </Button>
                    </Link>
                </Tooltip>
                <Tooltip title={t("actions.next")}>
                    <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${parseInt(pageNumber) + 1}/edit`}>
                        <Button disabled={!page || !page.links.next}>
                            {lang.isRtl ? <FaAngleLeft /> : <FaAngleRight />}
                        </Button>
                    </Link>
                </Tooltip>
            </Button.Group>
        );
    }
    actions.push(
        <Button.Group>
            <Button onClick={() => setShowImage(!showImage)}>
                {showImage ? <MdHideImage /> : <MdImage />}
            </Button>
            <Button onClick={() => setFullScreen(!fullScreen)}>
                {fullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </Button>
            <Button
                onClick={() =>
                    navigate(
                        `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}?section=pages`
                    )
                }
            >
                <FaTimesCircle />
            </Button>
        </Button.Group>
    );

    return (
        <>
            <PageHeader
                breadcrumb={<Breadcrumb
                    items={[
                        {
                            title: <Link to={`/libraries/${libraryId}`}><FaHome /></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals`}><Space><ImNewspaper />{t("header.periodicals")}</Space></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}`}><Space><ImNewspaper />{t("issue.volumeNumber.label")} {volumeNumber}</Space></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`}><Space><ImNewspaper />{t("issue.issueNumber.label")} {issueNumber}</Space></Link>,
                        }
                        ,
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}?section=pages`}><Space><ImNewspaper />{t("issue.pages.title")}</Space></Link>,
                        },
                        {
                            title: (<>
                                <EditingStatusIcon
                                    status={page && page.status}
                                    style={{ width: 16, height: 16 }}
                                /> {t('page.label', { sequenceNumber: page?.sequenceNumber })}
                            </>),
                        }
                    ]} />}
                actions={actions}
            />
            <DataContainer error={error || issueError} busy={isFetching | isAdding | isUpdating | isUpdatingImage | loadingIssue} >
                {hasUnsavedChanges && <Alert message={t("issue.pages.editor.unsavedContents")} type="info" closable action={
                    <Space>
                        <Button size="small" type="ghost" onClick={onApplyUnsavedChanges}>
                            {t('actions.yes')}
                        </Button>
                        <Button size="small" type="ghost" onClick={onClearUnsavedChanges}>
                            {t('actions.no')}
                        </Button>

                    </Space>
                } />}
                <Row gutter={16}>
                    <Col span={showImage ? 12 : 24} style={{ display: 'flex' }}>
                        <TextEditor value={text}
                            language={language}
                            onChange={onChange}
                            onSave={(c) => onSave(c)} />
                    </Col>
                    {showImage && (
                        <Col span={12}>
                            <PageImage page={page} t={t} fileList={fileList} setFileList={setFileList} />
                        </Col>
                    )}
                </Row>
            </DataContainer>
        </>
    );
};

export default IssuePageEditPage;
