import PropTypes from 'prop-types';

// 3rd party libraries
import { Group, Select } from '@mantine/core';

// Local Imports
import { IconTick } from '@/components/icons';

const PoetrytLayoutSelect = ({ t, defaultValue, onChange, ...props }) => {
    const options = [
        { value: "normal", label: t('poetry.editor.layouts.normal') },
        { value: "singleColumnPoetry", label: t('poetry.editor.layouts.singleColumnPoetry') },
        { value: "twoColumnPoetry", label: t('poetry.editor.layouts.twoColumnPoetry') }
    ];

    const renderSelectOption = ({ option, checked }) => (
        <Group flex="1" gap="xs">
            {option.label}
            {checked && <IconTick style={{ marginInlineStart: 'auto' }} />}
        </Group>
    );

    return (<Select {...props}
        allowDeselect={false}
        value={defaultValue}
        data={options}
        onChange={val => onChange && onChange(val)}
        renderOption={renderSelectOption}>
    </Select >);
};

PoetrytLayoutSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};


export default PoetrytLayoutSelect;
