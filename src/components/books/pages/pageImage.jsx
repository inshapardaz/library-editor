import { useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { App, Button, Flex, Upload } from "antd";
import { FaFileUpload } from "react-icons/fa";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";

// Local imports
import helpers from "../../../helpers";

// -----------------------------------------
const MIN_ZOOM = 10;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;
const PageImage = ({ page, t, fileList, setFileList }) => {
    const { message } = App.useApp();
    const [previewImage, setPreviewImage] = useState(null);
    const [zoom, setZoom] = useLocalStorage('page-image-zoom', 100);

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

    //const canZoom = useMemo(() => getCoverSrc() !== helpers.defaultPageImage, [getCoverSrc]);
    const canZoomIn = useMemo(() => zoom < MAX_ZOOM, [zoom]);
    const canZoomOut = useMemo(() => zoom > MIN_ZOOM, [zoom]);

    const zoomIn = () => {
        if (canZoomIn) {
            setZoom(z => z + ZOOM_STEP);
        }
    }

    const zoomOut = () => {
        if (canZoomOut) {
            setZoom(z => z - ZOOM_STEP);
        }
    }

    return (<>
        <Flex vertical>
            <Flex wrap="wrap" gap="small" >
                <Upload fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                    <Button icon={<FaFileUpload />} type="text">
                        {t('page.actions.uploadImage.label')}
                    </Button>
                </Upload>
                <Button icon={<MdOutlineZoomIn />} disabled={!canZoomIn} type="text" onClick={zoomIn}>
                    {t('actions.zoonIn')}
                </Button>
                <Button icon={<MdOutlineZoomOut />} disabled={!canZoomOut} type="text" onClick={zoomOut}>
                    {t('actions.zoonOut')}
                </Button>
            </Flex>
            <div flex={1} style={{ overflow: 'auto' }}>
                <img
                    src={getCoverSrc()}
                    height="300"
                    className="ant-upload-drag-icon"
                    alt={page && page.title}
                    onError={helpers.setDefaultPageImage}
                    style={{ width: `${zoom}%`, height: 'auto' }}
                />
            </div>
        </Flex>
    </>);
}

export default PageImage;;
