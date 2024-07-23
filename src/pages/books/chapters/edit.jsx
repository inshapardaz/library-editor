import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party imports
import { useLocalStorage } from "usehooks-ts";
import { Alert, App, Breadcrumb, Button, Space, Spin, Tooltip } from "antd";
import { FaAngleLeft, FaAngleRight, FaBook, FaCheckCircle, FaRegClone } from "/src/icons";

// Local imports
import {
    useGetBookQuery,
    useGetChapterQuery,
    useGetBookChaptersQuery,
    useGetChapterContentsQuery,
    useUpdateChapterMutation,
} from "/src/store/slices/booksSlice";
import { selectedLanguage } from '/src/store/slices/uiSlice'

import {
    addChapterContent,
    updateChapterContent
} from '/src/domain/bookService'
import { EditingStatus } from "/src/models";
import PageHeader from "/src/components/layout/pageHeader";
import DataContainer from "/src/components/layout/dataContainer";
import TextEditor from "/src/components/textEditor";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import ChapterAssignButton from "/src/components/books/chapters/chapterAssignButton";
import ChapterStatusButton from "/src/components/books/chapters/chapterStatusButton";
// ------------------------------------------

const EditChapter = () => {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage)
    const { libraryId, bookId, chapterNumber } = useParams();
    const [isBusy, setIsBusy] = useState(false)
    const [contents, setContents] = useState('')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [unsavedContent, setUnsavedContents] = useLocalStorage(`chapter-${libraryId}-${bookId}-${chapterNumber}`);
    const [updateChapter, { isLoading: isUpdatingChapter }] = useUpdateChapterMutation();

    const {
        data: book,
        error: bookError,
        isFetching: loadingBook,
    } = useGetBookQuery(
        { libraryId, bookId },
        { skip: !libraryId || !bookId }
    );

    const {
        data: chapters,
        error: chaptersError,
        isFetching: loadingChapters,
    } = useGetBookChaptersQuery(
        { libraryId, bookId, chapterNumber },
        { skip: loadingBook || !libraryId || !bookId }
    );

    const {
        data: chapter,
        error: chapterError,
        isFetching: loadingChapter,
    } = useGetChapterQuery(
        { libraryId, bookId, chapterNumber },
        { skip: loadingBook || !libraryId || !bookId || !chapterNumber }
    );

    const language = book?.language ?? lang?.key ?? 'en';

    const {
        data: chapterContent,
        error: chapterContentError,
        isFetching: loadingChapterContent,
    } = useGetChapterContentsQuery(
        { libraryId, bookId, chapterNumber, language },
        { skip: !book || !chapter || !language }
    );

    const isNewContent = () => {
        return chapterContentError && chapterContentError.status === 404;
    }

    useEffect(() => {
        setHasUnsavedChanges(localStorage.getItem(`chapter-${libraryId}-${bookId}-${chapterNumber}`) != null);
    }, [chapterNumber]);

    useEffect(() => {
        if (chapterContent) {
            setContents(chapterContent.text);
        }
    }, [chapterContent]);

    const onEditorSave = (content) => {
        if (isNewContent()) {
            setIsBusy(true);
            return addChapterContent({ chapter, language, payload: content })
                .then(() => message.success(t("book.actions.edit.success")))
                .then(() => setUnsavedContents(null))
                .catch(() => message.error(t("book.actions.edit.error")))
                .finally(() => setIsBusy(false));
        } else if (chapterContent) {
            setIsBusy(true);
            return updateChapterContent({ chapterContent, language, payload: content })
                .then(() => message.success(t("book.actions.add.success")))
                .then(() => setUnsavedContents(null))
                .catch(() => message.error(t("book.actions.add.error")))
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
                .then(() => message.success(t("chapter.actions.edit.success")))
                .catch(() => message.error(t("chapter.actions.edit.error")));
        }
    };


    const showCompleteButton =
        chapter &&
        (chapter.status === EditingStatus.Typing ||
            chapter.status === EditingStatus.InReview);

    const actions = chapter ? [
        <Button.Group key={chapter.id}>
            {showCompleteButton && (
                <Tooltip title={t("actions.done")}>
                    <Button onClick={onComplete}>
                        <FaCheckCircle />
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
            <Tooltip title={t("actions.previous")}>
                <Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber - 1}/edit`}>
                    <Button disabled={!chapter || !chapter.links.previous}>
                        {lang.isRtl ? <FaAngleRight /> : <FaAngleLeft />}
                    </Button>
                </Link>
            </Tooltip>
            <Tooltip title={t("actions.next")}>
                <Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber + 1}/edit`}>
                    <Button disabled={!chapter || !chapter.links.next}>
                        {lang.isRtl ? <FaAngleLeft /> : <FaAngleRight />}
                    </Button>
                </Link>
            </Tooltip>
        </Button.Group>,
    ] : [];

    const chaptersMenu = () => {
        if (chapters) {
            var menuItems = chapters?.data.map((c) => ({
                key: c.id,
                label: (
                    c.id === chapter?.id ? <> <EditingStatusIcon
                        status={c && c.status}
                        style={{ width: 16, height: 16 }}
                    /> {c.title}</> :
                        <Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${c.chapterNumber}/edit`}>
                            <EditingStatusIcon
                                status={c && c.status}
                                style={{ width: 16, height: 16 }}
                            /> {c.title}
                        </Link>
                )
            }));

            return { items: menuItems };
        }
        return null;
    };

    const onChange = (markdown) => {
        setUnsavedContents(markdown)
    }

    const onApplyUnsavedChanges = () => {
        if (unsavedContent) {
            setContents(unsavedContent);
        }

        onClearUnsavedChanges();
    }

    const onClearUnsavedChanges = () => {
        setUnsavedContents(null);
        setHasUnsavedChanges(false);
    }

    return (
        <>
            <Spin
                spinning={loadingChapter | loadingChapterContent | isBusy | isUpdatingChapter | loadingChapters | loadingBook}
            >
                <PageHeader
                    breadcrumb={<Breadcrumb
                        items={[
                            {
                                title: <Link to={`/libraries/${libraryId}/books/${bookId}`}><FaBook /> {book?.title}</Link>,
                            },
                            {
                                title: <Link to={`/libraries/${libraryId}/books/${bookId}?section=chapters`}><FaRegClone /> {t('chapters.title')}</Link>
                            },
                            {
                                title: (<>
                                    <EditingStatusIcon
                                        status={chapter && chapter.status}
                                        style={{ width: 16, height: 16 }}
                                    /> {chapter?.title}
                                </>),
                                menu: chaptersMenu()
                            }
                        ]}
                    />}
                    actions={actions}
                />
                <DataContainer error={chapterError | chapterContentError | bookError | chaptersError}>
                    {isNewContent() && <Alert message={t("chapter.editor.newContents")} type="success" closable />}
                    {hasUnsavedChanges && <Alert message={t("chapter.editor.unsavedContents")} type="info" closable action={
                        <Space>
                            <Button size="small" type="ghost" onClick={onApplyUnsavedChanges}>
                                {t('actions.yes')}
                            </Button>
                            <Button size="small" type="ghost" onClick={onClearUnsavedChanges}>
                                {t('actions.no')}
                            </Button>

                        </Space>
                    } />}

                    <TextEditor value={contents}
                        language={language}
                        onChange={onChange}
                        onSave={onEditorSave} />
                </DataContainer>
            </Spin>
        </>);
}

export default EditChapter;
