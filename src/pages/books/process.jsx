import PropTypes from 'prop-types';
import { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// UI Library Imports
import { Button, Card, Container, Divider, Grid, Group, Image, LoadingOverlay, Popover, Progress, ScrollArea, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core";

// Local Import
import { useGetBookQuery, useCreateBookPageWithImageMutation } from '@/store/slices/books.api';
import {
    IconProcessDocument,
    IconZoomIn,
    IconZoomOut,
    IconLeft,
    IconRight,
    IconFiles,
    IconSettingApplyAll,
    IconSettingApplyDown,
    IconFullScreenExit,
    IconFullScreen,
    IconSave,
    IconHelp
} from '@/components/icons';
import IconNames from '@/components/iconNames';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import If from '@/components/if';
import { downloadFile, loadPdfPage, splitImage, dataURItoBlob } from '@/utils'
import { pdfjsLib } from '@/utils/pdf'
import { useFullscreen, useHotkeys, useLocalStorage } from '@mantine/hooks';
import PageImageEditor from '../../components/books/pages/pageImageEditor';
import { selectedLanguage } from "@/store/slices/uiSlice";
import { languages } from '@/store/slices/uiSlice';
import { error, success } from '@/utils/notifications';
//---------------------------
const BusyContent = ({ processingProgress, t }) => {
    if (processingProgress.type === 'idle') return null;

    return (<Card>
        <Stack gap="md" justify="center" mih={200}>
            <Progress size={40} striped animated value={processingProgress.value} />
            <Text size="md" ta="center">
                {t(`book.actions.loadFileImages.messages.${processingProgress.type}`)}
            </Text>
        </Stack>
    </Card>);
}

BusyContent.propTypes = {
    processingProgress: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.number
    }),
    t: PropTypes.any
}

//---------------------------
const Help = ({ t }) => {
    return (<Popover width={200} position="bottom" withArrow shadow="md" zIndex={10001}>
        <Popover.Target>
            <Tooltip label={t("actions.help")}>
                <Button variant="default" size="sm" >
                    <IconHelp />
                </Button>
            </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
            <Stack>
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.processAndSave.title")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + Alt + S
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("actions.previous")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + Up
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("actions.next")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + Down
                    </Text>
                </Group>
                <Divider />
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.applySplitToAll.title")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + A
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.applySplitToAllBelow.title")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + N
                    </Text>
                </Group>
                <Divider />
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.split.save")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + X
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.split.title")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + D
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.split.moveLeft")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + Left
                    </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                    {t("book.actions.split.moveRight")}
                    <Text size="xs" c="dimmed">
                        ⌘ + Shift + Right
                    </Text>
                </Group>
            </Stack>
        </Popover.Dropdown>
    </Popover>)
}
Help.propTypes = {
    t: PropTypes.any,
}
//---------------------------

const BookProcessPage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const lang = useSelector(selectedLanguage);
    const { ref, toggle, fullscreen } = useFullscreen();

    const { libraryId, bookId, fileId } = useParams();
    const [loading, setLoading] = useState(false);
    const [processingProgress, setProcessingProgress] = useState({ type: 'idle', value: 0 });
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoom, setZoom] = useLocalStorage({ key: "page-image-editor-zoom", defaultValue: 100 });

    //-----------Data operations----------------
    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch
    } = useGetBookQuery({
        libraryId,
        bookId
    });

    const [createBookPageWithImage, { isLoading: isUploading }] = useCreateBookPageWithImageMutation();

    //-------------Editing functions---------------
    const currentFile = useMemo(() => book?.contents?.find(x => x.id == fileId), [book?.contents, fileId]);

    const loadImages = async (data = null) => {
        if (loading) return;

        try {

            setLoading(true);
            let file = null;

            if (data) {
                file = data;
            } else {
                setProcessingProgress({ type: 'downloadingFile', value: 0 });
                const onProgressDownload = ({ loaded, total }) => {
                    if (total > 0) {
                        setProcessingProgress({ type: 'downloadingFile', value: (loaded / total) * 100 });
                    }
                }

                file = await downloadFile(currentFile.links.download, onProgressDownload);
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
                    splitValue: null,
                    trimValue: null
                });
                onProgressPageLoading({ loaded: i, total: pdf.numPages })
            }

            setImages((e) => [...e, ...imagesList]);
            if (imagesList.length > 0) setSelectedImage(imagesList[0]);
            success({ message: t("book.actions.loadFileImages.messages.loaded") })
        }
        catch (e) {
            console.error(e)
            error({ message: t("book.actions.loadFileImages.messages.failedLoading") })
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
            success({ message: t("pages.actions.upload.success") })
        }
        catch (e) {
            console.error(e)
            error({ message: t("pages.actions.upload.error") })
        }
        finally {
            setProcessingProgress({ type: 'idle', value: 0 });
        }
    }

    //----------------Navigation-----------------------
    const canGoNext = useMemo(() => selectedImage && selectedImage.index < images.length - 1, [images.length, selectedImage]);
    const canGoPrevious = useMemo(() => selectedImage && selectedImage.index > 0, [selectedImage]);

    const goNext = () => {
        if (canGoNext) {
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
    //---------------Zoom --------------------------
    const canZoomIn = () => zoom < 200;
    const canZoomOut = () => zoom > 10;
    const resetZoom = () => {
        setZoom(100);
    }
    const zoomIn = () => {
        if (canZoomIn()) {
            setZoom(e => e + 10);
        }
    }
    const zoomOut = () => {
        if (canZoomOut) {
            setZoom(e => e - 10);
        }
    }
    //------------------------------------------------------

    useHotkeys([
        ['mod+shift+ArrowUp', goPrevious],
        ['mod+shift+ArrowDown', goNext],
        ['mod+shift+alt+S', savePages],
        ['mod+shift+A', applySettingsToAll],
        ['mod+shift+N', applySettingsToAllNext]
    ])
    //-------------Rendering---------------------
    if (errorLoadingBook) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    }

    const busy = loadingBook | loading | isUploading | processingProgress.type !== 'idle';
    const hasImagesLoaded = images && images.length > 0;
    return (<Container padding="sm" fluid>
        <LoadingOverlay visible={loadingBook} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <PageHeader
            title={t('book.actions.loadFileImages.title')}
            defaultIcon={IconNames.Pages}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
                { title: t(book?.title), href: `/libraries/${libraryId}/books/${bookId}`, icon: IconNames.Book },
                { title: t('book.files.title'), href: `/libraries/${libraryId}/books/${bookId}?section=files`, icon: IconNames.Files },
                {
                    title: currentFile?.fileName ?? t('book.actions.loadFileImages.title'), icon: IconNames.Pages, items: book?.contents?.map(c => ({
                        title: c.fileName,
                        key: c.id,
                        icon: IconNames.File,
                        href: `/libraries/${libraryId}/books/${bookId}/files/${c.id}/process`
                    }))
                },
            ]} />
        <If condition={!busy && currentFile && !hasImagesLoaded}>
            <Card withBorder >
                <Stack my={100} mx="auto" >
                    <IconFiles height={64} style={{ color: theme.colors.dark[3] }} />
                    <Title order={3} m="lg">
                        {currentFile?.fileName}
                    </Title>
                    <Button leftSection={<IconProcessDocument />} disabled={loading} onClick={() => loadImages()}>
                        {t('book.actions.loadFileImages.title')}
                    </Button>
                </Stack>
            </Card>
        </If>
        <If condition={busy}>
            <BusyContent t={t} processingProgress={processingProgress} />
        </If>
        <If condition={hasImagesLoaded && !busy}>
            <Container fluid bg="var(--mantine-color-body)" ref={ref}>
                <Group my="md">
                    <Tooltip label={t("actions.save")}>
                        <Button variant="default" size="sm" onClick={savePages} >
                            <IconSave />
                        </Button>
                    </Tooltip>
                    <Button.Group>
                        <Tooltip label={t("book.actions.applySplitToAll.title")}>
                            <Button variant="default" size="sm" onClick={applySettingsToAll} >
                                <IconSettingApplyAll />
                            </Button>
                        </Tooltip>
                        <Tooltip label={t("book.actions.applySplitToAllBelow.title")}>
                            <Button variant="default" size="sm" onClick={applySettingsToAllNext} >
                                <IconSettingApplyDown />
                            </Button>
                        </Tooltip>
                    </Button.Group>
                    <span style={{ flex: 1 }} />
                    <Button.Group>
                        <Tooltip label={t("actions.zoonIn")}>
                            <Button variant="default" size="sm" onClick={zoomIn} >
                                <IconZoomIn />
                            </Button>
                        </Tooltip>
                        <Tooltip label={t("actions.zoonReset")}>
                            <Button variant="default" size="sm" onClick={resetZoom} >
                                {`${zoom}%`}
                            </Button>
                        </Tooltip>
                        <Tooltip label={t("actions.zoonOut")}>
                            <Button variant="default" size="sm" onClick={zoomOut} >
                                <IconZoomOut />
                            </Button>
                        </Tooltip>
                    </Button.Group>
                    <Button.Group>
                        <Tooltip label={t("actions.previous")}>
                            <Button variant="default" size="sm" disabled={!canGoPrevious} onClick={goPrevious} >
                                {lang.isRtl ? <IconRight /> : <IconLeft />}
                            </Button>
                        </Tooltip>
                        <Button variant="default" size="sm">
                            {selectedImage ? `${selectedImage.index + 1} / ${images.length}` : ''}
                        </Button>
                        <Tooltip label={t("actions.next")}>
                            <Button variant="default" size="sm" disabled={!canGoNext} onClick={goNext} >
                                {lang.isRtl ? <IconLeft /> : <IconRight />}
                            </Button>
                        </Tooltip>
                    </Button.Group>
                    <Help t={t} />
                    <Tooltip key="fullscreen" label={t(fullscreen ? "actions.fullscreenExit" : "actions.fullscreen")}>
                        <Button variant="default" size="sm" onClick={toggle} >
                            {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
                        </Button>
                    </Tooltip>
                </Group>
                <Card withBorder >
                    <Grid mih={50} >
                        <Grid.Col span="content">
                            <ScrollArea style={{ height: `calc(100vh - ${fullscreen ? 90 : 260}px)`, position: 'relative' }}>
                                <Stack gap="sm">
                                    {images.map((x, index) => (
                                        <Card withBorder key={`image-list-${index}`}
                                            shadow={selectedImage?.index === x.index ? 'md' : null}
                                            style={{ borderColor: selectedImage?.index === x.index ? theme.colors.blue[6] : theme.colors.gray[6] }}
                                            onClick={() => setSelectedImage(x)} >
                                            <Image src={x.data} w={200} />
                                        </Card>
                                    ))}
                                </Stack>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <Card withBorder style={{ height: `calc(100vh - ${fullscreen ? 90 : 260}px)`, position: 'relative' }}>
                                <PageImageEditor t={t} isRtl={lang.isRtl}
                                    zoom={zoom}
                                    image={selectedImage}
                                    onNext={goNext}
                                    hasNext={canGoNext}
                                    onPrevious={goPrevious}
                                    canGoPrevious={canGoPrevious}
                                    onChange={updateImage}
                                />
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Card>
            </Container>
        </If >
    </Container >);
}

export default BookProcessPage;