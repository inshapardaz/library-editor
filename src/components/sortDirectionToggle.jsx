import PropTypes from 'prop-types';

// Ui Library Imports
import { Center, rem, SegmentedControl } from "@mantine/core";

// Local imports
import { IconSortAscending, IconSortDescending } from '@/components/icon';
import SortDirection from '@/models/sortDirection'

//-----------------------------------
const SortDirectionToggle = ({ value = SortDirection.Descending, onChange }) => {
    const layouts = [{
        value: SortDirection.Ascending,
        label: (
            <Center style={{ gap: 10 }}>
                <IconSortAscending style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    },
    {
        value: SortDirection.Descending,
        label: (
            <Center style={{ gap: 10 }}>
                <IconSortDescending style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    }]

    return <SegmentedControl size="md" onChange={onChange} value={value} data={layouts} />
}

SortDirectionToggle.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default SortDirectionToggle;