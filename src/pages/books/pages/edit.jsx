import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import { useLocalStorage } from "usehooks-ts";
import { App, Button, Col, Row, Tooltip, Breadcrumb } from "antd";
import {
    FaAngleLeft,
    FaAngleRight,
    FaBook,
    FaCheckCircle,
    FaRegFileAlt,
    FaTimesCircle,
} from "react-icons/fa";
import {
    MdFullscreen,
    MdFullscreenExit,
    MdHideImage,
    MdImage,
} from "react-icons/md";

// Local imports
import {
    useGetBookQuery,
    useGetBookPageQuery,
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useUpdateBookPageImageMutation,
} from "/src/store/slices/booksSlice";
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

const PageEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage)

    const [fullScreen, setFullScreen] = useState(false);
    const [showImage, setShowImage] = useLocalStorage("page-editor-show-image", true);
    const [fileList, setFileList] = useState();
    const [text, setText] = useState(null);
    const { libraryId, bookId, pageNumber } = useParams();

    const { data: book, error: bookError, isFetching: loadingBook, } = useGetBookQuery(
        { libraryId, bookId },
        { skip: !libraryId || !bookId }
    );

    const { data: page, error, isFetching } = useGetBookPageQuery(
        { libraryId, bookId, pageNumber },
        { skip: !libraryId || !bookId || !pageNumber }
    );

    const language = book?.language ?? lang?.key ?? 'en';
    const [addBookPage, { isLoading: isAdding }] = useAddBookPageMutation();
    const [updateBookPage, { isLoading: isUpdating }] = useUpdateBookPageMutation();
    const [updateBookPageImage, { isLoading: isUpdatingImage }] = useUpdateBookPageImageMutation();

    const uploadImage = useCallback((p) => {
        if (fileList && fileList[0]) {
            return updateBookPageImage({
                page: p,
                payload: fileList[0],
            }).unwrap();
        }
        return Promise.resolve();
    }, [fileList, updateBookPageImage]);

    const onSave = useCallback((contents) => {
        if (page) {
            const payload = {
                bookId: page.bookId,
                chapterId: page.chapterId,
                reviewerAccountId: page.reviewerAccountId,
                reviewerAssignTimeStamp: page.reviewerAssignTimeStamp,
                sequenceNumber: page.sequenceNumber,
                status: page.status,
                text: contents,
                links: page.links,
            };
            return updateBookPage({
                page: payload,
            })
                .unwrap()
                .then(uploadImage)
                .then(() => message.success(t("book.actions.edit.success")))
                .catch((e) => {
                    console.error(e);
                    message.error(t("book.actions.edit.error"))
                });
        } else {
            var newPage = null;
            return addBookPage({
                libraryId,
                bookId,
                payload: {
                    bookId,
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
                    `/libraries/${libraryId}/books/${bookId}/pages/${newPage.sequenceNumber}/edit`
                ))
                .then(() => message.success(t("book.actions.add.success")))
                .catch((e) => {
                    console.error(e);
                    message.error(t("book.actions.add.error"))
                });
        }
    }, [addBookPage, bookId, libraryId, message, navigate, page, t, updateBookPage, uploadImage]);

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
        return updateBookPage({ page: payload })
            .unwrap()
            .then(() => message.success(t("book.actions.edit.success")))
            .catch((e) => {
                console.error(e);
                message.error(t("book.actions.edit.error"))
            });
    };

    const actions = [
        <Button.Group key="complete-button">
            {showCompleteButton && (
                <Tooltip title={t("actions.done")}>
                    <Button onClick={onComplete}>
                        <FaCheckCircle />
                    </Button>
                </Tooltip>
            )}
            <PageOcrButton key="ocr-button" pages={[page]} t={t} />
            {page && page.links.assign && (
                <PageAssignButton
                    key="assign-button"
                    libraryId={libraryId}
                    pages={[page]}
                    t={t}
                    showDetails={false}
                />
            )}
            {page && page.links.update && (
                <PageStatusButton
                    key="status-button"
                    libraryId={libraryId}
                    pages={[page]}
                    t={t}
                />
            )}
        </Button.Group>,
    ];

    if (page && page.links && (page.links.previous || page.links.next)) {
        actions.push(
            <Button.Group>
                <Tooltip title={t("actions.previous")}>
                    <Button disabled={!page || !page.links.previous}>
                        <Link to={`/libraries/${libraryId}/books/${bookId}/pages/${parseInt(pageNumber) - 1}/edit`}>
                            {lang.isRtl ? <FaAngleRight /> : <FaAngleLeft />}
                        </Link>
                    </Button>
                </Tooltip>
                <Tooltip title={t("actions.next")}>
                    <Button disabled={!page || !page.links.next}>
                        <Link to={`/libraries/${libraryId}/books/${bookId}/pages/${parseInt(pageNumber) + 1}/edit`}>
                            {lang.isRtl ? <FaAngleLeft /> : <FaAngleRight />}
                        </Link>
                    </Button>
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
                        `/libraries/${libraryId}/books/${bookId}?section=pages`
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
                            title: <Link to={`/libraries/${libraryId}/books/${bookId}`}><FaBook /> {book?.title}</Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/books/${bookId}?section=pages`}><FaRegFileAlt /> {t('pages.title')}</Link>
                        },
                        {
                            title: (<>
                                <EditingStatusIcon
                                    status={page && page.status}
                                    style={{ width: 16, height: 16 }}
                                /> {t('page.label', { sequenceNumber: page?.sequenceNumber })}
                            </>),
                        }
                    ]}
                />}
                actions={actions}
            />
            <DataContainer error={error || bookError} busy={isFetching | isAdding | isUpdating | isUpdatingImage | loadingBook} >
                <Row gutter={16}>
                    <Col span={showImage ? 12 : 24} style={{ display: 'flex' }}>
                        <TextEditor value={text}
                            language={language}
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

export default PageEditPage;
