import PropTypes from 'prop-types';

// Ui Library Imports
import { Center, rem, SegmentedControl } from "@mantine/core";

// Local imports
import { IconWriting, IconPoetries, IconAuthors } from '@/components/icon'

//-----------------------------------
const AuthorTypeToggle = ({ value, onChange }) => {
    const layouts = [{
        value: 'all',
        label: (
            <Center style={{ gap: 10 }}>
                <IconAuthors style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    }, {
        value: 'writer',
        label: (
            <Center style={{ gap: 10 }}>
                <IconWriting style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    },
    {
        value: 'poet',
        label: (
            <Center style={{ gap: 10 }}>
                <IconPoetries style={{ width: rem(16), height: rem(16) }} />
            </Center>
        ),
    }]

    return <SegmentedControl size="md" onChange={onChange} value={value ? value : 'all'} data={layouts} />
}

AuthorTypeToggle.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default AuthorTypeToggle;