import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import { useLocalStorage } from "usehooks-ts";
import { App, Button, Col, Row, Upload, Spin } from "antd";
import {
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaTimesCircle,
} from "react-icons/fa";
import {
    MdFullscreen,
    MdFullscreenExit,
    MdHideImage,
    MdImage,
} from "react-icons/md";

import Editor from 'urdu-web-editor'

// Local imports
import {
    useGetBookPageQuery,
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useUpdateBookPageImageMutation,
} from "../../../features/api/booksSlice";
import PageHeader from "../../../components/layout/pageHeader";
import DataContainer from "../../../components/layout/dataContainer";
import EditingStatusIcon from "../../../components/editingStatusIcon";
import { selectedLanguage } from '../../../features/ui/uiSlice'
import helpers from "../../../helpers";
import PageStatus from "../../../models/pageStatus";
import PageOcrButton from "../../../components/books/pages/pageOcrButton";
import { useSelector } from "react-redux";

// -----------------------------------------
const { Dragger } = Upload;

// -----------------------------------------

const PageEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage)

    const [fullScreen, setFullScreen] = useState(false);
    const [showImage, setShowImage] = useLocalStorage(
        "page-editor-show-image",
        true
    );
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    const { libraryId, bookId, pageNumber } = useParams();
    const {
        data: page,
        error,
        isFetching,
    } = useGetBookPageQuery(
        { libraryId, bookId, pageNumber },
        { skip: !libraryId || !bookId || !pageNumber }
    );
        console.log(page)
    const [text, setText] = useState("");

    const [addBookPage, { isLoading: isAdding }] = useAddBookPageMutation();
    const [updateBookPage, { isLoading: isUpdating }] =
        useUpdateBookPageMutation();
    const [updateBookPageImage, { isLoading: isUpdatingImage }] =
        useUpdateBookPageImageMutation();

    const onSave = async (contents) => {
        debugger;
        if (page) {
            const payload = {
                bookId: page.bookId,
                chapterId: page.chapterId,
                reviewerAccountId: page.reviewerAccountId,
                reviewerAssignTimeStamp: page.reviewerAssignTimeStamp,
                sequenceNumber: page.sequenceNumber,
                status: page.status,
                contents,
                links: page.links,
            };
            updateBookPage({
                page: payload,
            })
                .unwrap()
                .then(() => uploadImage(bookId))
                .then(() => message.success(t("book.actions.edit.success")))
                .catch((_) => message.error(t("book.actions.edit.error")));
        } else {
            let response = null;
            addBookPage({
                libraryId,
                bookId,
                payload: {
                    bookId,
                    contents,
                },
            })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.sequenceNumber))
                .then(() => message.success(t("book.actions.add.success")))
                .catch((_) => message.error(t("book.actions.add.error")));
        }
    };

    const editorConfiguration =   {
        richText: true,
        language: lang?.key ?? 'en',
        toolbar: {
            showAlignment: false,
            showFontFormat: true,
            showInsert: true,
            showExtraFormat: false,
            showInsertLink: false,
            showBlockFormat: true,
            showSave: true
        },
        onSave: onSave,
        format: "markdown"
    }

    useEffect(() => {
        setText(page?.text || "");
    }, [page]);

    const uploadImage = async (pageNumber) => {
        if (fileList && fileList.length > 0) {
            await updateBookPageImage({
                libraryId,
                bookId,
                pageNumber,
                payload: fileList[0],
            }).unwrap();
        }
    };

    const showCompleteButton =
        page &&
        (page.status === PageStatus.Typing ||
            page.status === PageStatus.InReview);

    const onComplete = () => {
        if (page.status === PageStatus.Typing) {
            page.status = PageStatus.Typed;
        } else if (page.status === PageStatus.InReview) {
            page.status = PageStatus.Completed;
        } else {
            return;
        }
        //onSave();
    };

    const onImageChange = (file) => {
        const isImage = ["image/png", "image/jpeg"].includes(file.type);
        if (!isImage) {
            message.error(t("errors.imageRequired"));
            return;
        }
        setFileList([file]);
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
        });
        fileReader.readAsDataURL(file);
        return false;
    };

    const getCoverSrc = () => {
        if (previewImage) {
            return previewImage;
        } else if (page && page.links.image) {
            return page.links.image;
        }

        return helpers.defaultPageImage;
    };
    const title = pageNumber
        ? t("page.actions.edit.title", { sequenceNumber: pageNumber })
        : t("page.actions.add.title");

    const actions = [
        <Button.Group>
            {showCompleteButton && (
                <Button onClick={onComplete}>
                    <FaCheckCircle />
                </Button>
            )}
            <PageOcrButton pages={[page]} t={t} />
        </Button.Group>,
    ];

    if (page && page.links && (page.links.previous || page.links.next)) {
        var previousButton = (
            <Button
                disabled={!page.links.previous}
                onClick={() =>
                    navigate(
                        `/libraries/${libraryId}/books/${bookId}/pages/${
                            parseInt(pageNumber) - 1
                        }/edit`
                    )
                }
            >
                <FaChevronRight />
            </Button>
        );

        var nextButton = (
            <Button
                disabled={!page.links.next}
                onClick={() =>
                    navigate(
                        `/libraries/${libraryId}/books/${bookId}/pages/${
                            parseInt(pageNumber) + 1
                        }/edit`
                    )
                }
            >
                <FaChevronLeft />
            </Button>
        );

        actions.push(
            <Button.Group>
                {previousButton}
                {nextButton}
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
            <Spin
                spinning={isFetching | isAdding | isUpdating | isUpdatingImage}
            >
                <PageHeader
                    title={title}
                    icon={
                        <EditingStatusIcon
                            status={page && page.status}
                            style={{ width: 36, height: 36 }}
                        />
                    }
                    actions={actions}
                />
                <DataContainer error={error}>
                    <Row gutter={16}>
                        <Col span={12} style={{display: 'flex'}}>
                            <Editor
                                configuration={editorConfiguration}
                                value={text}
                            />
                        </Col>
                        {showImage && (
                            <Col span={12}>
                                <Dragger
                                    fileList={fileList}
                                    beforeUpload={onImageChange}
                                    showUploadList={false}
                                >
                                    <img
                                        src={getCoverSrc()}
                                        height="300"
                                        className="ant-upload-drag-icon"
                                        alt={page && page.title}
                                        onError={helpers.setDefaultPageImage}
                                    />
                                </Dragger>
                            </Col>
                        )}
                    </Row>
                </DataContainer>
            </Spin>
        </>
    );
};

export default PageEditPage;
