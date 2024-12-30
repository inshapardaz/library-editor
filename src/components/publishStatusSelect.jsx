import PropTypes from 'prop-types';

// 3rd party libraries
import { Group, Select } from '@mantine/core';

// Local Imports
import { BookStatus } from '@/models';
import { IconAvailableForTyping, IconBeingTyped, IconReadyForProofRead, IconProofRead, IconPublished, IconTick } from '@/components/icons';
// -------------------------------------------------

const StatusIcon = {
    AvailableForTyping: <IconAvailableForTyping />,
    BeingTyped: <IconBeingTyped />,
    ReadyForProofRead: <IconReadyForProofRead />,
    ProofRead: <IconProofRead />,
    Published: <IconPublished />,
}

const PublishStatusSelect = ({ t, defaultValue, onChange, ...props }) => {

    const statuses = [
        { value: BookStatus.AvailableForTyping, label: t('bookStatus.AvailableForTyping') },
        { value: BookStatus.BeingTyped, label: t('bookStatus.BeingTyped') },
        { value: BookStatus.ReadyForProofRead, label: t('bookStatus.ReadyForProofRead') },
        { value: BookStatus.ProofRead, label: t('bookStatus.ProofRead') },
        { value: BookStatus.Published, label: t('bookStatus.Published') },
    ];

    const renderSelectOption = ({ option, checked }) => (
        <Group flex="1" gap="xs">
            {StatusIcon[option.value]}
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

PublishStatusSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};


export default PublishStatusSelect;
