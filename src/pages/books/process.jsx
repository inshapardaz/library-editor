import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useHotkeys } from 'react-hotkeys-hook';

// 3rd party libraries
import { App, Button, Card, Col, theme, Layout, List, Progress, Row, Space, Typography, Image, Tooltip, Result } from "antd";
import * as pdfjsLib from "pdfjs-dist";
import { MdContentCopy, MdZoomIn, MdZoomOut } from "react-icons/md";
import { TbSettingsCode, TbSettingsDown } from "react-icons/tb";
import { FaArrowLeft, FaArrowRight, FaFilePdf, FaRegFilePdf, FaSave } from "react-icons/fa";
import * as worker from 'pdfjs-dist/build/pdf.worker.mjs';

// Local Imports
import { axiosPrivate } from '../../helpers/axios.helpers';
import { useGetBookQuery, useCreateBookPageWithImageMutation } from "../../features/api/booksSlice";
import { languages } from '../../features/ui/uiSlice';
import DataContainer from "../../components/layout/dataContainer";
import helpers from '../../helpers';
import { PageImageEditor } from "../../components/books/pages/PageImageEditor";

// --------------------------------------
const { Content, Sider, Header } = Layout;
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
// --------------------------------------

const downloadFile = async (url, onProgress = () => {} ) => {
    const response = await axiosPrivate({
        url : url,
        method: 'GET',
        responseType: 'blob'
    });

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            const data = atob(e.target.result.replace(/.*base64,/, ""));
            resolve(data);
        };
        reader.onprogress = ({loaded, total}) => onProgress({loaded, total});
        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        reader.readAsDataURL(response.data);
    });
}

const loadPage = async (pdf, index) => {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("className", "canv");
        var page = await pdf.getPage(index);
        var viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var render_context = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
        };
        await page.render(render_context).promise;
        return canvas.toDataURL("image/png");
};

// --------------------------------------

const BookProcessPage = () => {
    const { message } = App.useApp();
    const {
        token: { colorBgContainer, colorBorder },
    } = theme.useToken();
    const { t } = useTranslation();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processingProgress, setProcessingProgress] = useState({ type: 'idle', value: 0});
    const [imageZoom, setImageZoom] = useLocalStorage("page-editor-zoom", 100);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const { libraryId, bookId, contentId } = useParams();

    const { data: book, error, isFetching } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });
    const [createBookPageWithImage, { isLoading: isUploading }] = useCreateBookPageWithImageMutation();

    useEffect(() => {
        if (book && book.contents)
        {
            setContent(book.contents.filter(x => `${x.id}` === contentId)[0]);
        }
    }, [book, contentId])

    const loadImages = async () => {
        if (loading) return;

        setLoading(true);
        setProcessingProgress({ type: 'downloadingFile', value: 0});
        message.info(t("book.actions.loadFileImages.messages.loading"))

        try {
            const onProgressDownload = ({loaded, total}) =>  {
                if (total > 0)
                {
                    setProcessingProgress({ type: 'downloadingFile', value: (loaded / total) * 100});
                }
            }

            const file = await downloadFile(content.links.download, onProgressDownload);

            const onProgressPageLoading = ({loaded, total}) =>  {
                if (total > 0)
                {
                    setProcessingProgress({ type: 'loadingPages', value: (loaded / total) * 100});
                }
            }

            const imagesList = [];

            const pdf = await (pdfjsLib.getDocument({ data: file }).promise);
            onProgressPageLoading({ loaded : 0, total: pdf.numPages})

            for (let i = 1; i <= pdf.numPages; i++) {

                let img = await loadPage(pdf, i);
                imagesList.push({
                    index: i -1,
                    data : img,
                    selected : false,
                    split: false,
                    splitValue: null
                });
                onProgressPageLoading({ loaded : i, total: pdf.numPages})
            }

            setImages((e) => [...e, ...imagesList]);
            message.success(t("book.actions.loadFileImages.messages.loaded"))
        }
        catch (e) {
            console.error(e)
            message.error(t("book.actions.loadFileImages.messages.failedLoading"))
        }
        finally {
            setProcessingProgress({ type: 'idle', value: 0});
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
            for (var i = 0; i < newImages.length; i++)
            {
                newImages[i].split = selectedImage.split;
                newImages[i].splitValue = selectedImage.splitValue;
            }
            setImages(newImages);
        }
    }

    const applySettingsToAllNext = () => {
        if (selectedImage && images && images.length > 0) {
            const newImages = [...images];
            for (var i = selectedImage.index + 1; i < newImages.length; i++)
            {
                newImages[i].split = selectedImage.split;
                newImages[i].splitValue = selectedImage.splitValue;
            }
            setImages(newImages);
        }
    }

    const savePages = async () =>  {
        setProcessingProgress({ type: 'savingPages', value: 0 });

        try {
            const isRtl = () => languages[book?.language]?.dir === 'rtl';

            setProcessingProgress({ type: 'savingPages', value: 0});

            const data = [];
            for(let i = 0; i < images.length; i++)
            {
                const image = images[i];
                if (image.split)
                {
                    const splitImage = await helpers.splitImage({ URI : image.data, splitPercentage: image.splitValue, rtl: isRtl } );
                    data.push(splitImage);
                } else {
                    data.push(image.data);
                }
            }

            const files = data.flat().map(d => helpers.dataURItoBlob(d));
            const chunkSize = 10;
            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                await (createBookPageWithImage({  book, fileList: chunk}).unwrap())
                setProcessingProgress({ type: 'savingPages', value: (i * 100) / files.length });
            }
            message.success(t("pages.actions.upload.success"))
        }
        catch(e) {
            console.error(e)
            message.error(t("pages.actions.upload.error"))
        }
        finally {
            setProcessingProgress({ type: 'idle', value: 0});
        }
    }

    //------------------------------------------------------
    const canZoomIn = () => imageZoom < 200;
    const canZoomOut = () => imageZoom > 10;
    const zoomIn = () => {
        if (canZoomIn())
        {
            setImageZoom(e => e + 10);
        }
    }
    const zoomOut = () => {
        if (canZoomOut)
        {
            setImageZoom(e => e - 10);
        }
    }

    //------------------------------------------------------
    const canGoNext = () => selectedImage && selectedImage.index < images.length - 1 ;
    const canGoPrevious = () => selectedImage && selectedImage.index > 0;
    const goNext = () => {
        if (canGoNext())
        {
            const currentIndex = images.findIndex(x => x.index === selectedImage.index);
            setSelectedImage(images[currentIndex + 1]);
        }
    }
    const goPrevious = () => {
        if (canGoPrevious)
        {
            const currentIndex = images.findIndex(x => x.index === selectedImage.index);
            setSelectedImage(images[currentIndex - 1]);
        }
    }
    //------------------------------------------------------
    useHotkeys('ctrl+left', goNext, {enabled : canGoNext()})
    useHotkeys('ctrl+right', goPrevious, {enabled : canGoPrevious()})
    //------------------------------------------------------
    const toolbar = (
        <Row gutter={8}>
            <Col>
                {book
                    ? <Link  disabled={!images || images.length < 1 || loading || isUploading }
                        to={`/libraries/${libraryId}/books/${bookId}?section=files`}><Button type="text">{book.title}</Button></Link>
                    : null}
            </Col>
            <Col>
                <Button.Group>
                    <Tooltip title={t('book.actions.loadFileImages.title')}>
                        <Button onClick={loadImages}
                            icon={<FaRegFilePdf />}
                            disabled={loading || isUploading} />
                    </Tooltip>
                </Button.Group>
            </Col>
            <Col>
                <Button.Group disabled={selectedImage == null || isUploading }>
                    <Tooltip title={t('book.actions.applySplitToAll.title')}>
                        <Button onClick={applySettingsToAll} icon={<TbSettingsCode />} />
                    </Tooltip>
                    <Tooltip title={t('book.actions.applySplitToAllBelow.title')} >
                        <Button onClick={applySettingsToAllNext} icon={<TbSettingsDown />}/>
                    </Tooltip>
                </Button.Group>
            </Col>
            <Col>
                <Button.Group>
                    <Tooltip title={t('book.actions.processAndSave.title')}>
                        <Button onClick={savePages}
                            icon={<FaSave />}
                            disabled={!images || images.length < 1 || loading || isUploading } />
                    </Tooltip>
                </Button.Group>
            </Col>
            {images && images.length > 1 &&
            (<><Col>
                <Button.Group disabled={ selectedImage }>
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
                <Button.Group disabled={ selectedImage }>
                    <Tooltip title={t('actions.next')}>
                        <Button onClick={goPrevious} disabled={!canGoPrevious()} icon={<FaArrowRight />} />
                    </Tooltip>
                    <Button disabled>{ selectedImage && t('book.actions.loadFileImages.page', {current: (selectedImage?.index ?? -1) + 1, total: images.length }) }</Button>
                    <Tooltip title={t('actions.previous')}>
                        <Button onClick={goNext} disabled={!canGoNext()} icon={<FaArrowLeft />} />
                    </Tooltip>
                </Button.Group>
            </Col></>)}
        </Row>
    );

    const busyContent = () => {

        if (processingProgress.type === 'idle') return null;

        return (<Card>
                <Progress percent={processingProgress.value} showInfo={false} />
                <Typography>
                    { t(`book.actions.loadFileImages.messages.${processingProgress.type}`)}
                </Typography>
            </Card>);
    }

    if (content && content?.mimeType !== "application/pdf")
    {
        return (<Result
            status="error"
            icon={<FaFilePdf size="3em"/>}
            title={t('book.actions.loadFileImages.messages.errorFileType')}
            extra={[
                <a href={`/libraries/${libraryId}/books/${bookId}?section=files`}>
                    <Button>{t('book.actions.loadFileImages.selectOtherFile')}</Button>
                </a>
            ]}
        />)
    }

    return (<>
            <DataContainer
                busy={isFetching | loading | isUploading | processingProgress.type !== 'idle'}
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
                        <Button onClick={loadImages} disabled={loading}>
                            {t('book.actions.loadFileImages.title')}
                        </Button>
                    </Space>) }
                empty={!content || !content.links.download || (images && images.length < 1)}
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
                                    style={selectedImage?.index === image.index ? {backgroundColor : colorBorder } : null}>
                                    <List.Item.Meta
                                        avatar={<Image src={image.data} alt={image.index} preview={false} width={100} />}
                                        title={image.index}
                                    />
                                </List.Item>
                                )}
                            />
                        </Sider>
                        <Content>
                            <PageImageEditor image={selectedImage} zoom={imageZoom} t={t} onUpdate={updateImage}/>
                        </Content>
                    </Layout>
                </Layout>
            </DataContainer>
        </>);
};

export default BookProcessPage;
