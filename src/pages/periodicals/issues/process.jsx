import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useHotkeys } from 'react-hotkeys-hook';

// 3rd party libraries
import { App, Button, Card, Col, theme, Layout, List, Progress, Row, Space, Typography, Image, Tooltip, Result, Dropdown, Upload, Skeleton, Breadcrumb } from "antd";
import { FaBook, FaChevronDown, FaFileUpload, ImBooks, MdContentCopy, MdZoomIn, MdZoomOut } from "/src/icons";
import { TbSettingsCode, TbSettingsDown } from "react-icons/tb";
import { FaArrowLeft, FaArrowRight, FaFilePdf, FaRegFilePdf, FaSave } from "/src/icons";

// Local Imports
import { useGetBookQuery, useCreateBookPageWithImageMutation } from "/src/store/slices/booksSlice";
import { languages } from '/src/store/slices/uiSlice';
import { downloadFile, loadPdfPage, splitImage, dataURItoBlob, readBinaryFile } from '/src/util';
import DataContainer from "/src/components/layout/dataContainer";
import PageImageEditor from "/src/components/books/pages/PageImageEditor";
import { pdfjsLib } from '/src/util/pdf'
import FileTypeIcon from "/src/components/fileTypeIcon";
import PageHeader from "/src/components/layout/pageHeader";
import AuthorAvatar from "/src/components/author/authorAvatar";
import ContentsContainer from "/src/components/layout/contentContainer";

// --------------------------------------
const { Content, Sider, Header } = Layout;
// --------------------------------------

const isPdf = (file) => file.type === 'application/pdf';

// --------------------------------------


const IssueProcessPage = () => {
    const { message } = App.useApp();
    const {
        token: { colorBgContainer, colorBorder },
    } = theme.useToken();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processingProgress, setProcessingProgress] = useState({ type: 'idle', value: 0 });
    const [imageZoom, setImageZoom] = useLocalStorage("page-editor-zoom", 100);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const { libraryId, bookId, contentId } = useParams();

    const { data: book, error, isFetching } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });
    const [createBookPageWithImage, { isLoading: isUploading }] = useCreateBookPageWithImageMutation();

    useEffect(() => {
        if (book && book.contents) {
            setContent(book.contents.filter(x => `${x.id}` === contentId)[0]);
        }
    }, [book, contentId])

    useEffect(() => {
        if (content) {
            loadImages();
        }
    }, [content])

    const loadImages = async (data = null) => {
        if (loading) return;

        try {

            setLoading(true);
            let file = null;
            message.info(t("book.actions.loadFileImages.messages.loading"))
            if (data) {
                file = data;
            } else {
                setProcessingProgress({ type: 'downloadingFile', value: 0 });
                const onProgressDownload = ({ loaded, total }) => {
                    if (total > 0) {
                        setProcessingProgress({ type: 'downloadingFile', value: (loaded / total) * 100 });
                    }
                }

                file = await downloadFile(content.links.download, onProgressDownload);
            }
            const onProgressPageLoading = ({ loaded, total }) => {
                if (total > 0) {
                    setProcessingProgress({ type: 'loadingPages', value: (loaded / total) * 100 });
                }
            }

            const imagesList = [];

            const pdf = await (pdfjsLib.getDocument({ data: file }).promise);
            onProgressPageLoading({ loaded: 0, total: pdf.numPages })

            for (let i = 1; i <= pdf.numPages; i++) {

                let img = await loadPdfPage(pdf, i);
                imagesList.push({
                    index: i - 1,
                    data: img,
                    selected: false,
                    split: false,
                    splitValue: null
                });
                onProgressPageLoading({ loaded: i, total: pdf.numPages })
            }

            setImages((e) => [...e, ...imagesList]);
            if (imagesList.length > 0) setSelectedImage(imagesList[0]);
            message.success(t("book.actions.loadFileImages.messages.loaded"))
        }
        catch (e) {
            console.error(e)
            message.error(t("book.actions.loadFileImages.messages.failedLoading"))
        }
        finally {
            setProcessingProgress({ type: 'idle', value: 0 });
            setLoading(false);
        }
    };

    const updateImage = (newImage) => {
        const currentIndex = images.findIndex(x => x.index === newImage.index);
        if (currentIndex !== -1) {
            const newImages = [...images];
            newImages[currentIndex] = newImage;
            setImages(newImages);
        }

        setSelectedImage(newImage);
    };

    //------------------------------------------------------

    const applySettingsToAll = () => {
        if (selectedImage && images && images.length > 0) {
            const newImages = [...images];
            for (var i = 0; i < newImages.length; i++) {
                newImages[i].split = selectedImage.split;
                newImages[i].splitValue = selectedImage.splitValue;
            }
            setImages(newImages);
        }
    }

    const applySettingsToAllNext = () => {
        if (selectedImage && images && images.length > 0) {
            const newImages = [...images];
            for (var i = selectedImage.index + 1; i < newImages.length; i++) {
                newImages[i].split = selectedImage.split;
                newImages[i].splitValue = selectedImage.splitValue;
            }
            setImages(newImages);
        }
    }

    const savePages = async () => {
        setProcessingProgress({ type: 'savingPages', value: 0 });

        try {
            const isRtl = () => languages[book?.language]?.dir === 'rtl';

            setProcessingProgress({ type: 'savingPages', value: 0 });

            const data = [];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                if (image.split) {
                    const splitImageObj = await splitImage({ URI: image.data, splitPercentage: image.splitValue, rtl: isRtl });
                    data.push(splitImageObj);
                } else {
                    data.push(image.data);
                }
            }

            const files = data.flat().map(d => dataURItoBlob(d));
            const chunkSize = 10;
            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                await (createBookPageWithImage({ book, fileList: chunk }).unwrap())
                setProcessingProgress({ type: 'savingPages', value: (i * 100) / files.length });
            }
            message.success(t("pages.actions.upload.success"))
        }
        catch (e) {
            console.error(e)
            message.error(t("pages.actions.upload.error"))
        }
        finally {
            setProcessingProgress({ type: 'idle', value: 0 });
        }
    }

    //------------------------------------------------------
    const canZoomIn = () => imageZoom < 200;
    const canZoomOut = () => imageZoom > 10;
    const zoomIn = () => {
        if (canZoomIn()) {
            setImageZoom(e => e + 10);
        }
    }
    const zoomOut = () => {
        if (canZoomOut) {
            setImageZoom(e => e - 10);
        }
    }

    //------------------------------------------------------
    const canGoNext = () => selectedImage && selectedImage.index < images.length - 1;
    const canGoPrevious = () => selectedImage && selectedImage.index > 0;
    const goNext = () => {
        if (canGoNext()) {
            const currentIndex = images.findIndex(x => x.index === selectedImage.index);
            setSelectedImage(images[currentIndex + 1]);
        }
    }
    const goPrevious = () => {
        if (canGoPrevious) {
            const currentIndex = images.findIndex(x => x.index === selectedImage.index);
            setSelectedImage(images[currentIndex - 1]);
        }
    }

    //------------------------------------------------------
    useHotkeys('ctrl+shift+keydown', goNext, { enabled: canGoNext() })
    useHotkeys('ctrl+shift+keyup', goPrevious, { enabled: canGoPrevious() })
    //------------------------------------------------------

    const toolbar = (
        <Row gutter={8}>
            <Col>
                <Button.Group disabled={selectedImage == null || isUploading}>
                    <Tooltip title={t('book.actions.applySplitToAll.title')}>
                        <Button onClick={applySettingsToAll} icon={<TbSettingsCode />} />
                    </Tooltip>
                    <Tooltip title={t('book.actions.applySplitToAllBelow.title')} >
                        <Button onClick={applySettingsToAllNext} icon={<TbSettingsDown />} />
                    </Tooltip>
                </Button.Group>
            </Col>
            {images && images.length > 1 &&
                (<><Col>
                    <Button.Group disabled={selectedImage}>
                        <Tooltip title={t('actions.zoonIn')}>
                            <Button onClick={zoomIn} disabled={!canZoomIn()} icon={<MdZoomIn />} />
                        </Tooltip>
                        <Button disabled>{imageZoom}%</Button>
                        <Tooltip title={t('actions.zoonOut')}>
                            <Button onClick={zoomOut} disabled={!canZoomOut()} icon={<MdZoomOut />} />
                        </Tooltip>
                    </Button.Group>
                </Col>
                    <Col>
                        <Button.Group disabled={selectedImage}>
                            <Tooltip title={t('actions.next') + '(ctrl+shift+up)'}>
                                <Button onClick={goPrevious} disabled={!canGoPrevious()} icon={<FaArrowRight />} />
                            </Tooltip>
                            <Button disabled>{selectedImage && t('book.actions.loadFileImages.page', { current: (selectedImage?.index ?? -1) + 1, total: images.length })}</Button>
                            <Tooltip title={t('actions.previous') + '(ctrl+shift+down)'}>
                                <Button onClick={goNext} disabled={!canGoNext()} icon={<FaArrowLeft />} />
                            </Tooltip>
                        </Button.Group>
                    </Col></>)}
        </Row>
    );

    const onFileSelected = async (file) => {
        try {

            if (isPdf(file)) {
                const data = await readBinaryFile(file);
                await loadImages(data);
            } else {
                message.error(t('book.actions.loadFileImages.messages.errorFileType'));
            }
        }
        finally {
            return false;
        }

    };

    const props = {
        name: 'file',
        disabled: isUploading,
        showUploadList: false,
        beforeUpload: onFileSelected
    };

    const busy = isFetching | loading | isUploading | processingProgress.type !== 'idle';

    const mainToolbar = (<>
        <Space>
            <Tooltip title={t('book.actions.processAndSave.title')}>
                <Button onClick={savePages}
                    icon={<FaSave />}
                    disabled={!images || images.length < 1 || busy} />
            </Tooltip>
            <Upload {...props}>
                <Button icon={<FaFileUpload />}
                    disabled={busy} >
                    {t('pages.actions.upload.label')}
                </Button>
            </Upload>
            {book && book.contents && book.contents.length > 0 &&
                <Dropdown
                    disabled={busy}
                    menu={{
                        selectable: true,
                        onSelect: async ({ key }) => {
                            navigate(`/libraries/${libraryId}/books/${book.id}/contents/${key}/process`)
                        },
                        defaultSelectedKeys: [contentId],
                        items: book.contents.map(c => ({
                            label: c.fileName,
                            key: c.id,
                            icon: <FileTypeIcon
                                type={c.mimeType}
                            />
                        }))
                    }}>
                    <Button>
                        <Space>
                            <Typography>{content ? content.fileName : t('book.files.title')}</Typography>
                            <FaChevronDown />
                        </Space>
                    </Button>
                </Dropdown>
            }
        </Space>
    </>);
    const busyContent = () => {
        if (processingProgress.type === 'idle') return null;

        return (<Card>
            <Space>
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
            </Space>
            <Progress percent={processingProgress.value} showInfo={false} />
            <Typography>
                {t(`book.actions.loadFileImages.messages.${processingProgress.type}`)}
            </Typography>
        </Card>);
    }

    return (<>
        <PageHeader
            title={book?.title}
            subTitle={
                <Space>
                    {book &&
                        book.authors.map((author) => (
                            <AuthorAvatar
                                key={author.id}
                                libraryId={libraryId}
                                author={author}
                                t={t}
                                showName={true}
                            />
                        ))}
                </Space>
            }
            icon={<ImBooks style={{ width: 36, height: 36 }} />}
            actions={mainToolbar}
            breadcrumb={<Breadcrumb
                items={[
                    {
                        title: <Link to={`/libraries/${libraryId}/books/${bookId}`}><FaBook /> {book?.title}</Link>,
                    },
                    {
                        title: t('pages.actions.upload.label')
                    }
                ]}
            />}
        />
        <ContentsContainer>
            <DataContainer
                busy={busy}
                busyContent={busyContent()}
                error={error}
                errorTitle={t("pages.errors.loading.title")}
                errorSubTitle={t("pages.errors.loading.subTitle")}
                errorAction={
                    <Button type="default" onClick={loadImages} disabled={loading}>
                        {t("actions.retry")}
                    </Button>
                }
                emptyImage={<MdContentCopy size="5em" />}
                emptyDescription={(<Space direction="vertical">
                    {t("pages.empty.title")}
                </Space>)}
                empty={images && images.length < 1}
                bordered={false}
                style={{ padding: "0" }}
            >
                <Layout
                    style={{ padding: "0", background: colorBgContainer }}
                >
                    <Header style={{
                        background: colorBgContainer,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        {toolbar}
                    </Header>
                    <Layout>
                        <Sider
                            width={200}
                            breakpoint="lg"
                            collapsedWidth={0}
                            style={{
                                background: colorBgContainer,
                                overflow: 'auto',
                                position: 'sticky',
                                height: '100vh',
                                top: 0,
                                bottom: 0,
                            }}
                        >
                            <List
                                dataSource={images}
                                itemLayout="vertical"
                                size="large"
                                bordered={true}
                                renderItem={(image) => (
                                    <List.Item
                                        onClick={() => setSelectedImage(image)}
                                        style={selectedImage?.index === image.index ? { backgroundColor: colorBorder } : null}>
                                        <List.Item.Meta
                                            avatar={<Image src={image.data} alt={image.index} preview={false} width={100} />}
                                            title={image.index}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sider>
                        <Content>
                            <PageImageEditor image={selectedImage} zoom={imageZoom} t={t} onUpdate={updateImage} isRtl={languages[book?.language]?.dir === 'rtl'} />
                        </Content>
                    </Layout>
                </Layout>
            </DataContainer >
        </ContentsContainer>
    </>);
};

export default IssueProcessPage;
