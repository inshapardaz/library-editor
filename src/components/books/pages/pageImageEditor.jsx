import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// UI Library Imports
import { Button, Center, Group, ScrollArea, Slider, Stack, Switch, useMantineTheme } from "@mantine/core";

// Local imports
import { IconSave, IconPage } from '@/components/icons';
import Img from '@/components/img';
import If from '@/components/if';
//-------------------------------
const max = 1000;
const marks = [{ value: 0 }, { value: 500 }, { value: 1000 }];
//-------------------------------
const PageImageEditor = ({ image, onChange = () => { }, zoom }) => {
    const theme = useMantineTheme();
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
        if (dirty) {
            var newImage = { ...image };
            newImage.split = checked;
            newImage.splitValue = (sliderValue / max) * 100;
            onChange(newImage);
        }
    };

    useEffect(() => {
        setChecked(image?.split);
        setSliderValue(Number((image?.splitValue ? (image?.splitValue * max) / 100 : max / 2).toFixed()));
        setDirty(false)
    }, [image, image?.split, image?.splitValue]);

    if (!image) return;
    const icon = <Center h={450}><IconPage width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Stack style={{ flex: 1, overflow: 'hidden' }}>
            <Group>
                <Button variant="default" onClick={save}><IconSave /></Button>
                <Switch
                    checked={checked}
                    onChange={(event) => onChangeSplit(event.currentTarget.checked)}
                />
            </Group>
            <If condition={checked}>
                <Slider min={0} max={max} marks={marks}
                    onChange={onChangeSplitValue}
                    value={typeof sliderValue === 'number' ? sliderValue : 0} />
            </If>
            <ScrollArea style={{ flex: 1 }} >
                <span className="imageSplitDividerLine"
                    style={{
                        right: `${sliderValue * 100 / max}%`,
                        visibility: checked ? 'visible' : 'hidden',
                        position: 'absolute',
                        display: 'block',
                        height: '100%',
                        width: '1px',
                        background: 'magenta',
                        zIndex: '1000'
                    }} />
                <Img src={image?.data}
                    radius="0"
                    fallback={icon}
                    height="auto"
                    width="auto"
                    fit={null}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top' }} />

            </ScrollArea>
        </Stack>);
}

PageImageEditor.propTypes = {
    image: PropTypes.shape({
        index: PropTypes.number,
        data: PropTypes.any,
        selected: PropTypes.bool,
        split: PropTypes.bool,
        splitValue: PropTypes.number,
        trim: PropTypes.bool,
        trimValue: PropTypes.number
    }),
    onChange: PropTypes.func,
    zoom: PropTypes.number,
};

export default PageImageEditor;