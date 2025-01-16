import PropTypes from 'prop-types';
import { useMemo } from 'react';

// UI Library Import
import { Button, Center, FileButton, Group, Stack, Tooltip, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

// Local imports
import { IconZoomIn, IconZoomOut, IconPage, IconUpload } from '@/components/icons';
import Img from '@/components/img';

//----------------------------
const MIN_ZOOM = 10;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

const PageImage = ({ page, t, image, onChange = () => { } }) => {
    const theme = useMantineTheme();
    const [zoom, setZoom] = useLocalStorage({
        key: "page-editor-image-zoom",
        defaultValue: 100
    });

    const icon = <Center h={450}><IconPage width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const getImage = () => {
        if (image) {
            return image;
        } else if (page && page.links.image) {
            return page.links.image;
        }

        return null;
    };

    const setImage = (file) => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            onChange(fileReader.result);
        });
        fileReader.readAsDataURL(file);
    }

    //----------- Zoom functions ------------------------

    const canZoomIn = useMemo(() => zoom < MAX_ZOOM, [zoom]);
    const canZoomOut = useMemo(() => zoom > MIN_ZOOM, [zoom]);

    const resetZoom = () => {
        setZoom(100);
    }

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

    //----------- Render ------------------------

    return (<Stack>
        <Group>
            <FileButton onChange={setImage} accept="image/png,image/jpeg">
                {(props) => <Tooltip label={t("page.actions.uploadImage.label")}>
                    <Button {...props} variant="default" size="xs" >
                        <IconUpload />
                    </Button>
                </Tooltip>}
            </FileButton>
            <Button.Group>
                <Tooltip label={t("actions.zoonIn")}>
                    <Button variant="default" size="xs" onClick={zoomIn} >
                        <IconZoomIn />
                    </Button>
                </Tooltip>
                <Tooltip label={t("actions.zoonReset")}>
                    <Button variant="default" size="xs" onClick={resetZoom} >
                        {`${zoom}%`}
                    </Button>
                </Tooltip>
                <Tooltip label={t("actions.zoonOut")}>
                    <Button variant="default" size="xs" onClick={zoomOut} >
                        <IconZoomOut />
                    </Button>
                </Tooltip>
            </Button.Group>
        </Group>
        <div style={{ overflow: 'auto', position: 'relative' }}>
            <Img
                src={getImage()}
                radius="0"
                fallback={icon}
                height="auto"
                width="auto"
                fit={null}
                style={{ transform: `scale(${zoom / 100})` }}
            />
        </div>
    </Stack>)
}

PageImage.propTypes = {
    t: PropTypes.any,
    page: PropTypes.shape({
        links: PropTypes.shape({
            image: PropTypes.string
        })
    }),
    image: PropTypes.string,
    onChange: PropTypes.func,
};

export default PageImage;