import PropTypes from 'prop-types';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { Copyrights } from '@/models';
import { IconTick } from '@/components/icons';
// -------------------------------------------------

const CopyrightSelect = ({ t, defaultValue, placeholder, onChange, ...props }) => {

    const copyrights = [
        { value: Copyrights.Unknown, label: t('copyrights.Unknown') },
        { value: Copyrights.Copyright, label: t('copyrights.Copyright') },
        { value: Copyrights.PublicDomain, label: t('copyrights.PublicDomain') },
        { value: Copyrights.Open, label: t('copyrights.Open') },
        { value: Copyrights.CreativeCommons, label: t('copyrights.CreativeCommons') },
    ];

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: (eventSource) => {
            if (eventSource === 'keyboard') {
                combobox.selectActiveOption();
            } else {
                combobox.updateSelectedOptionIndex('active');
            }
        },
    });

    const options = copyrights.map((item) => (
        <Combobox.Option value={item.value} key={item.value} active={item.value === defaultValue}>
            <Group gap="xs">
                {item.value === defaultValue && <IconTick size={12} />}
                <span>{item.label}</span>
            </Group>
        </Combobox.Option>
    ));

    return (
        <Combobox {...props}
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
                onChange && onChange(val);
                combobox.updateSelectedOptionIndex('active');
            }}
        >
            <Combobox.Target targetType="button">
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {defaultValue && copyrights.find(x => x.value == defaultValue)?.label || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

CopyrightSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};


export default CopyrightSelect;
