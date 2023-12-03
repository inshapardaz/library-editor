import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// 3rd party libraries
import { App, Button, Card, Checkbox, Col, theme, Layout, List, Progress, Row, Space, Typography, Image, Tooltip, Result } from "antd";
import * as pdfjsLib from "pdfjs-dist";
import { MdContentCopy } from "react-icons/md";
import { TbSettingsCode, TbSettingsDown } from "react-icons/tb";
import { FaFilePdf, FaRegFilePdf, FaSave } from "react-icons/fa";
import * as worker from 'pdfjs-dist/build/pdf.worker.mjs';

// Local Imports
import { useGetBookQuery, useCreateBookPageWithImageMutation } from "../../features/api/booksSlice";
import CheckboxButton from "../../components/checkboxButton";
import DataContainer from "../../components/layout/dataContainer";
import helpers from '../../helpers';
import { PageImageEditor } from "../../components/books/pages/PageImageEditor";

// --------------------------------------
const { Content, Sider } = Layout;
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
// --------------------------------------

const BookProcessPage = () => {
    const { message } = App.useApp();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { t } = useTranslation();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selection, setSelection] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [numOfPages, setNumOfPages] = useState(0)
    const [numOfPagesParsed, setNumOfPagesParsed] = useState(0)
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
        message.info(t("book.actions.loadFileImages.messages.loading"))

        return fetch(content.links.download)
            .then((response) => {
                return response.blob()
                    .then((blob) => {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            const data = atob(e.target.result.replace(/.*base64,/, ""));
                            return loadPages(data);
                        };
                        reader.readAsDataURL(blob);
                    });
                });
    };

    const loadPages = async (data) => {
        try {
            const imagesList = [];
            const canvas = document.createElement("canvas");
            canvas.setAttribute("className", "canv");
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            setNumOfPages((e) => e + pdf.numPages);

            for (let i = 1; i <= pdf.numPages; i++) {
                var page = await pdf.getPage(i);
                var viewport = page.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                var render_context = {
                    canvasContext: canvas.getContext("2d"),
                    viewport: viewport,
                };
                await page.render(render_context).promise;
                let img = canvas.toDataURL("image/png");
                imagesList.push({
                    index: i -1,
                    data : img,
                    selected : false,
                    split: false,
                    splitValue: null
                });
                setNumOfPagesParsed(e => e + 1 )
            }

            setImages((e) => [...e, ...imagesList]);
            message.success(t("book.actions.loadFileImages.messages.loaded"))
        }
        catch {
            message.error(t("book.actions.loadFileImages.messages.failedLoading"))
        }
        finally {
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

    const savePages = () =>  {
        const promises = images
            .map(i => i.split ? helpers.splitImage(i.data, i.splitValue ) : Promise.resolve(i.data));
        Promise.all(promises)
            .then((data) => {
                const files = data.flat().map(d => helpers.dataURItoBlob(d));
                return createBookPageWithImage({
                    book,
                    fileList: files
                })
                .unwrap()
                .then(() => message.success(t("pages.actions.upload.success")))
                .catch((e) => {
                    console.error(e)
                    message.error(t("pages.actions.upload.error"))
                });
            })
            .catch((e) => {
                console.error(e)
                message.error(t("pages.actions.upload.error"))
            });
    }
    //------------------------------------------------------
    const hasAllSelected = selection.length  > 0 && selection.length === images.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < images.length;

    const onSelectChanged = (image) => {
        const currentIndex = images.findIndex(x => x.index === image.index);
        const newSelection = [...selection];

        if (currentIndex === -1) {
            newSelection.push(image.index);
        } else {
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
    };

    const onSelectAll = () => {
        if (images.length > 0 && selection.length === images.length) {
            setSelection([]);
        } else {
            setSelection(images.map((p) => p.index));
        }
    };

    //------------------------------------------------------
    const toolbar = (
        <Row gutter={8}>
            <Col>
                {book
                    ? <Link to={`/libraries/${libraryId}/books/${bookId}?section=files`}><Button type="text">{book.title}</Button></Link>
                    : null}
            </Col>
            <Col>
                <Button.Group>
                    <CheckboxButton
                        onChange={onSelectAll}
                        checked={hasAllSelected}
                        disabled={images.length < 1}
                        indeterminate={hasPartialSelection}
                    />
                    <Tooltip title={t('book.actions.loadFileImages.title')}>
                        <Button onClick={loadImages} icon={<FaRegFilePdf />} disabled={loading || isUploading} />
                    </Tooltip>
                    <Tooltip title={t('book.actions.applySplitToAll.title')}>
                        <Button onClick={applySettingsToAll} icon={<TbSettingsCode />} disabled={selectedImage == null || isUploading }/>
                    </Tooltip>
                    <Tooltip title={t('book.actions.applySplitToAllBelow.title')} >
                        <Button onClick={applySettingsToAllNext} icon={<TbSettingsDown />} disabled={selectedImage == null || isUploading } />
                    </Tooltip>
                    <Tooltip title={t('book.actions.processAndSave.title')}>
                        <Button onClick={savePages} icon={<FaSave />} disabled={!images || images.count < 1 || isUploading } />
                    </Tooltip>
                </Button.Group>
            </Col>
        </Row>
    );

    const busyContent = loading ?
        (<Card>
            <Progress percent={numOfPages > 0 ? ((numOfPagesParsed / numOfPages) * 100).toFixed(0): 0 } />
            <Typography>
                {t('book.actions.loadFileImages.progress', { completed: numOfPagesParsed, total: numOfPages})}
            </Typography>
        </Card>)
        : null;

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
                busy={isFetching | loading }
                busyContent={busyContent}
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
                title={toolbar}
                bordered={false}
            >
                <Layout
                    style={{ padding: "24px 0", background: colorBgContainer }}
                >
                    <Sider
                        width={400}
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
                            renderItem={(image) => (
                            <List.Item>
                                <Card extra={<Image src={image.data} alt={image.index} preview={false} />} onClick={() => setSelectedImage(image)} >
                                    <Card.Meta
                                        title={image.index}
                                        avatar={
                                            <Checkbox
                                                    checked={image.selected}
                                                    onChange={() => onSelectChanged(image)}
                                            />
                                        }
                                    />
                                </Card>
                            </List.Item>
                            )}
                        />
                    </Sider>
                    <Content>
                        <PageImageEditor image={selectedImage} t={t} onUpdate={updateImage}/>
                    </Content>
                </Layout>
            </DataContainer>
        </>);
};

export default BookProcessPage;
