import PropTypes from 'prop-types';

// Ui Library Imports
import { Center, rem, SegmentedControl } from "@mantine/core";

// Local imports
import { IconLayoutList, IconLayoutGrid } from '@/components/icon'

//-----------------------------------
const LayoutToggle = ({ value, onChange }) => {
    const layouts = [{
        value: 'list',
        label: (
            <Center style={{ gap: 10 }}>
                <IconLayoutList style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    },
    {
        value: 'card',
        label: (
            <Center style={{ gap: 10 }}>
                <IconLayoutGrid style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    }]

    return <SegmentedControl size="md" onChange={onChange} value={value} data={layouts} />
}

LayoutToggle.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default LayoutToggle;