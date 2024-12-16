import PropTypes from 'prop-types';

// Ui Library Imports
import { Center, SegmentedControl } from "@mantine/core";

// Local imports
import { IconReaderImage, IconReaderText } from '@/components/icon'
//-----------------------------------
const ReadModeToggle = ({ value, onChange }) => {
    const layouts = [{
        value: 'image',
        label: (
            <Center style={{ gap: 10 }}>
                <IconReaderImage />
            </Center>
        ),
    },
    {
        value: 'text',
        label: (
            <Center style={{ gap: 10 }}>
                <IconReaderText />
            </Center>
        ),
    }];

    return <SegmentedControl size="lg" onChange={onChange} value={value} data={layouts} />
}

ReadModeToggle.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default ReadModeToggle;