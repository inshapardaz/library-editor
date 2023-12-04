import { useEffect, useState } from "react";

// 3rd party libraries
import { Button, Card, Space, Image, Slider, Switch, Tooltip, Result } from "antd";
import { FaFileImage, FaRegSave } from "react-icons/fa";

// Local imports
import styles from '../../../styles/common.module.scss';

// --------------------------------------
export const PageImageEditor = ({ image, t, zoom = 100, onUpdate = () => { } }) => {
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

    useEffect(() => {
        setChecked(image?.split);
        setSliderValue(Number((image?.splitValue ? (image?.splitValue * max) / 100 : max / 2).toFixed()));
        setDirty(false)
    }, [image?.split, image?.splitValue]);

    if (!image) {
        return (<Result
            status="info"
            icon={<FaFileImage size="3em" />}
            title={t('book.actions.loadFileImages.messages.selectImage')} />);
    }

    const save = () => {
        var newImage = { ...image };
        newImage.split = checked;
        newImage.splitValue = (sliderValue / max) * 100;
        onUpdate(newImage);
    };
    //------------------------------------------------------
    const toolbar = (<Space>
        {t('book.actions.split.title')}
        <Switch
            size="small"
            checked={checked}
            onChange={onChangeSplit} />
        <Tooltip title={t('actions.save')}>
            <Button onClick={save} icon={<FaRegSave />}  disabled={!dirty} />
        </Tooltip>
    </Space>);

    return (<>
        <Card title={toolbar}>
            <Space direction="vertical">
                { checked && <Slider min={0} max={max} marks={marks}
                    onChange={onChangeSplitValue}
                    value={typeof sliderValue === 'number' ? sliderValue : 0} /> }
                <div className={styles.imageSplitDivider}>
                    <span className={styles.imageSplitDividerLine}
                        style={{ right: `${sliderValue * 100 / max}%`, visibility: checked ? 'visible' : 'hidden' }} />
                    <Image src={image.data} alt={image.index} preview={false} width={`${zoom}%`} />
                </div>
            </Space>
        </Card>
    </>);
};
