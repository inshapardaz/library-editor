import { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';

// 3rd party libraries
import { Button, Card, Space, Slider, Switch, Tooltip, Result } from "antd";
import { FaFileImage, FaRegSave } from "react-icons/fa";

// Local imports
import * as styles from '~/src/styles/common.module.scss';

// --------------------------------------
export const PageImageEditor = ({ image, t, zoom = 100, isRtl = false, onUpdate = () => { } }) => {
    const max = 1000;
    const marks = { 0: '|', 500: '|', 1000: '|' };
    const [dirty, setDirty] = useState(false);
    const [checked, setChecked] = useState(false);
    const [sliderValue, setSliderValue] = useState(Number((max / 2).toFixed()));

    const onChangeSplit = (chk) => {
        setChecked(chk);
        setDirty(true)
    };

    const onChangeSplitValue = (newValue) => {
        setSliderValue(newValue);
        setDirty(true)
    };

    const save = () => {
        var newImage = { ...image };
        newImage.split = checked;
        newImage.splitValue = (sliderValue / max) * 100;
        onUpdate(newImage);
    };

    //------------------------------------------------------
    useHotkeys(isRtl ? 'ctrl+shift+left' : 'ctrl+right', () => onChangeSplitValue(sliderValue + 10), { enabled: checked, preventDefault: true })
    useHotkeys(isRtl ? 'ctrl+shift+right' : 'ctrl+left', () => onChangeSplitValue(sliderValue - 10), { enabled: checked, preventDefault: true })
    useHotkeys('ctrl+shift+x', () => setChecked(true), { enabled: !checked })
    useHotkeys('ctrl+shift+.', () => save(), { enabled: checked, preventDefault: true })
    //------------------------------------------------------

    useEffect(() => {
        setChecked(image?.split);
        setSliderValue(Number((image?.splitValue ? (image?.splitValue * max) / 100 : max / 2).toFixed()));
        setDirty(false)
    }, [image, image?.split, image?.splitValue]);

    if (!image) {
        return (<Result
            status="info"
            icon={<FaFileImage size="3em" />}
            title={t('book.actions.loadFileImages.messages.selectImage')} />);
    }

    //------------------------------------------------------
    const toolbar = (<Space>
        <Tooltip title={t('book.actions.split.title') + '(ctrl+shift+x)'} >
            <Switch
                size="small"
                checked={checked}
                onChange={onChangeSplit} />
        </Tooltip>
        <Tooltip title={t('actions.save') + '(ctrl+shift+.)'} >
            <Button onClick={save} icon={<FaRegSave />} disabled={!dirty} />
        </Tooltip>
    </Space>);

    return (<>
        <Card title={toolbar}>
            <Space direction="vertical" style={{ width: `${zoom}%` }}>
                {checked && <Slider min={0} max={max} marks={marks}
                    onChange={onChangeSplitValue}
                    value={typeof sliderValue === 'number' ? sliderValue : 0} />}
                <div className={styles.imageSplitDivider}>
                    <span className={styles.imageSplitDividerLine}
                        style={{ right: `${sliderValue * 100 / max}%`, visibility: checked ? 'visible' : 'hidden' }} />
                    <img src={image.data} alt={image.index} style={{ objectFit: 'contain' }} width="100%" />
                </div>
            </Space>
        </Card>
    </>);
};
