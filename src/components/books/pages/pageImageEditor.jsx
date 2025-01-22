import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// UI Library Imports
import { Box, Button, Center, Group, Slider, Stack, Switch, Tooltip, useMantineTheme } from "@mantine/core";

// Local imports
import { IconSave, IconPage, IconSplitVertical } from '@/components/icons';
import Img from '@/components/img';
import If from '@/components/if';
import { useHotkeys } from '@mantine/hooks';
//-------------------------------
const max = 1000;
const marks = [{ value: 500 }];
//-------------------------------
const PageImageEditor = ({ t, image, onChange = () => { }, zoom, isRtl }) => {
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

    //------------------------------------------------------

    useHotkeys([
        [isRtl ? 'mod+shift+ArrowLeft' : 'mod+shift+ArrowRight', () => checked && onChangeSplitValue(sliderValue + 10)],
        [isRtl ? 'mod+shift+ArrowRight' : 'mod+shift+ArrowLeft', () => checked && onChangeSplitValue(sliderValue - 10)],
        ['mod+shift+D', () => setChecked(!checked)],
        ['mod+shift+X', () => dirty && save()]
    ])
    //------------------------------------------------------


    if (!image) return;

    const icon = <Center h={450}><IconPage width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Stack style={{ flex: 1, overflow: 'hidden' }}>
            <Group>
                <Tooltip label={t('actions.save')} >
                    <Button variant="default" disabled={!dirty} onClick={save}><IconSave /></Button>
                </Tooltip>
                <Switch label={t('book.actions.split.title')}
                    checked={checked}
                    onChange={(event) => onChangeSplit(event.currentTarget.checked)}
                />
            </Group>
            <Box style={{ flex: 1, width: `${zoom}%`, position: 'relative' }} >
                <If condition={checked}>
                    <Slider min={0} max={max} marks={marks} color='gray'
                        thumbChildren={<IconSplitVertical height={32} />}
                        thumbSize={32}
                        onChange={onChangeSplitValue}
                        value={typeof sliderValue === 'number' ? sliderValue : 0} />
                </If>
                <span style={{
                    left: isRtl ? null : `${sliderValue * 100 / max}%`,
                    right: isRtl ? `${sliderValue * 100 / max}%` : null,
                    visibility: checked ? 'visible' : 'hidden',
                    position: 'absolute',
                    display: 'inline-block',
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
                />

            </Box>
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
    t: PropTypes.any,
    onChange: PropTypes.func,
    zoom: PropTypes.number,
    isRtl: PropTypes.bool,
};

export default PageImageEditor;