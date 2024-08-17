import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party imports
import { Alert, App, Breadcrumb, Button, Space, Spin, Tooltip } from "antd";
import { FaAngleLeft, FaAngleRight, FaBook, FaCheckCircle, FaHome, FaRegClone, ImNewspaper } from "/src/icons";

// Local imports
import {
    useGetIssueQuery,
    useGetArticleQuery,
    useGetIssueArticlesQuery,
    useGetArticleContentsQuery,
} from "/src/store/slices/issuesSlice";
import {
    useUpdateIssueArticleMutation
} from '/src/store/slices/issueArticlesSlice';
import { useUpdateArticleMutation } from "/src/store/slices/articlesSlice";
import { selectedLanguage } from '/src/store/slices/uiSlice'

import {
    addIssueArticleContent,
    updateIssueArticleContent
} from '/src/domain/bookService'
import { EditingStatus } from "/src/models";
import PageHeader from "/src/components/layout/pageHeader";
import DataContainer from "/src/components/layout/dataContainer";
import TextEditor from "/src/components/textEditor";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import IssueArticleAssignButton from "/src/components/periodicals/issues/article/issueArticleAssignButton";
import IssueArticleStatusButton from "/src/components/periodicals/issues/article/issueArticleStatusButton";
// ------------------------------------------

const EditIssueArticle = () => {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage)
    const { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber } = useParams();
    const [isBusy, setIsBusy] = useState(false)
    const [contents, setContents] = useState('')
    const [updateArticle, { isLoading: isUpdatingArticle }] = useUpdateArticleMutation();

    const {
        data: issue,
        error: issueError,
        isFetching: loadingIssue,
    } = useGetIssueQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber },
        { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber }
    );

    const {
        data: articles,
        error: articlesError,
        isFetching: loadingArticles,
    } = useGetIssueArticlesQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber },
        { skip: loadingIssue || !libraryId || !periodicalId || !volumeNumber || !issueNumber }
    );

    const {
        data: article,
        error: articleError,
        isFetching: loadingArticle,
    } = useGetArticleQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber },
        { skip: loadingIssue || !libraryId || !periodicalId || !volumeNumber || !issueNumber || !articleNumber }
    );

    const language = issue?.language ?? lang?.key ?? 'en';

    const {
        data: articleContent,
        error: articleContentError,
        isFetching: loadingArticleContent,
    } = useGetArticleContentsQuery(
        { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber, language },
        { skip: !issue || !article || !language }
    );

    const isNewContent = () => {
        return articleContentError && articleContentError.status === 404 ? true : false;
    }

    useEffect(() => {
        if (articleContent) {
            if (articleContent.text) {
                setContents(articleContent.text);
            }
        }
    }, [articleContent]);

    const onEditorSave = (content) => {
        if (isNewContent()) {
            setIsBusy(true);
            return addIssueArticleContent({ article, language, payload: content })
                .then(() => message.success(t("book.actions.edit.success")))
                .catch(() => message.error(t("book.actions.edit.error")))
                .finally(() => setIsBusy(false));
        } else if (articleContent) {
            setIsBusy(true);
            return updateIssueArticleContent({ articleContent, language, payload: content })
                .then(() => message.success(t("book.actions.add.success")))
                .catch(() => message.error(t("book.actions.add.error")))
                .finally(() => setIsBusy(false));
        }
    };

    const onComplete = () => {
        if (article.status === EditingStatus.Typing || article.status === EditingStatus.InReview) {
            const payload = {
                ...article,
                status: article.status === EditingStatus.Typing ? EditingStatus.Typed : EditingStatus.Completed,
            };
            return useUpdateIssueArticleMutation({ url: article.links.update, payload })
                .unwrap()
                .then(() => message.success(t("chapter.actions.edit.success")))
                .catch(() => message.error(t("chapter.actions.edit.error")));
        }
    };


    const showCompleteButton =
        article &&
        (article.status === EditingStatus.Typing ||
            article.status === EditingStatus.InReview);

    const actions = article ? [
        <Button.Group key={article.id}>
            {showCompleteButton && (
                <Tooltip title={t("actions.done")}>
                    <Button onClick={onComplete}>
                        <FaCheckCircle />
                    </Button>
                </Tooltip>
            )}
            {article && article.links.assign && (
                <IssueArticleAssignButton
                    libraryId={libraryId}
                    articles={[article]}
                    t={t}
                    showDetails={false}
                />
            )}
            {article && article.links.update && (
                <IssueArticleStatusButton
                    libraryId={libraryId}
                    articles={[article]}
                    t={t}
                />
            )}
            <Tooltip title={t("actions.previous")}>
                <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber - 1}/edit`}>
                    <Button disabled={!article || !article.links.previous}>
                        {lang.isRtl ? <FaAngleRight /> : <FaAngleLeft />}
                    </Button>
                </Link>
            </Tooltip>
            <Tooltip title={t("actions.next")}>
                <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article?.sequenceNumber + 1}/edit`}>
                    <Button disabled={!article || !article.links.next}>
                        {lang.isRtl ? <FaAngleLeft /> : <FaAngleRight />}
                    </Button>
                </Link>
            </Tooltip>
        </Button.Group>,
    ] : [];

    const articleMenu = () => {
        if (articles) {
            var menuItems = articles?.data.map((ar) => ({
                key: ar.id,
                label: (
                    ar.id === article?.id ? <> <EditingStatusIcon
                        status={ar && ar.status}
                        style={{ width: 16, height: 16 }}
                    /> {ar.title}</> :
                        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${ar?.sequenceNumber}/edit`}>
                            <EditingStatusIcon
                                status={ar && ar.status}
                                style={{ width: 16, height: 16 }}
                            /> {ar.title}
                        </Link>
                )
            }));

            return { items: menuItems };
        }
        return null;
    };

    return (
        <>
            <Spin
                spinning={loadingArticle | loadingArticleContent | isBusy | isUpdatingArticle | loadingArticles | loadingIssue}
            >
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
                                title: (<>
                                    <EditingStatusIcon
                                        status={article && article.status}
                                        style={{ width: 16, height: 16 }}
                                    /> {article?.title}
                                </>),
                                menu: articleMenu()
                            }
                        ]} />}
                    actions={actions}
                />
                <DataContainer error={articleError | articleContentError | issueError | articlesError}>
                    {isNewContent() && <Alert message={t("chapter.editor.newContents")} type="success" closable />}
                    <TextEditor value={contents}
                        language={language}
                        contentKey={`issue-article-${libraryId}-${periodicalId}-${volumeNumber}-${issueNumber}-${articleNumber}`}
                        onSave={onEditorSave} />
                </DataContainer>
            </Spin>
        </>);
}

export default EditIssueArticle;
