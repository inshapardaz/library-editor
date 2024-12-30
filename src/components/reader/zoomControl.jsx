import PropTypes from 'prop-types';

// UI library import
import { ActionIcon, Box, HoverCard, Slider } from "@mantine/core";

// Local Import
import { IconZoomIn } from '@/components/icons';
//----------------------------------------
const minZoom = -200;
const maxZoom = 200;
var marks = []
for (var j = minZoom; j <= maxZoom; j = j + 100) {
    marks.push({ value: j, label: `${j}` })
}
const ZoomControl = ({ value, onChange }) => {
    return (
        <HoverCard width={280} shadow="md">
            <HoverCard.Target>
                <ActionIcon size={36} variant="default" disabled={value > maxZoom} ><IconZoomIn /></ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Box m="md">
                    <Slider
                        value={value}
                        onChange={onChange}
                        marks={marks}
                        min={minZoom}
                        max={maxZoom}
                        step={10}
                    />
                </Box>

            </HoverCard.Dropdown>
        </HoverCard>);
}

ZoomControl.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
}

export default ZoomControl