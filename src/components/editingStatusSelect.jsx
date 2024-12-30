import PropTypes from 'prop-types';

// 3rd party libraries
import { Group, Select } from '@mantine/core';

// Local Imports
import { EditingStatus } from '@/models';
import { IconTick } from '@/components/icons';
import EditingStatusIcon from './editingStatusIcon';

const EditingStatusSelect = ({ t, defaultValue, onChange, ...props }) => {

    const statuses = [
        { value: EditingStatus.Available, label: t('editingStatus.Available') },
        { value: EditingStatus.Typing, label: t('editingStatus.Typing') },
        { value: EditingStatus.Typed, label: t('editingStatus.Typed') },
        { value: EditingStatus.InReview, label: t('editingStatus.InReview') },
        { value: EditingStatus.Completed, label: t('editingStatus.Completed') },
    ];

    const renderSelectOption = ({ option, checked }) => (
        <Group flex="1" gap="xs">
            <EditingStatusIcon editingStatus={option.value} />
            {option.label}
            {checked && <IconTick style={{ marginInlineStart: 'auto' }} />}
        </Group>
    );

    return (<Select {...props}
        allowDeselect={false}
        defaultValue={defaultValue}
        data={statuses}
        onChange={val => onChange && onChange(val)}
        renderOption={renderSelectOption}>
    </Select >);
};

EditingStatusSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};


export default EditingStatusSelect;
