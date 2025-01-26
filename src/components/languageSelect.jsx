import PropTypes from 'prop-types';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { languages } from '@/store/slices/uiSlice';
import { IconTick } from '@/components/icons';
// -------------------------------------------------

const languageOptions = Object.values(languages)
    .map(l => ({ value: l.key, label: l.name }));

const LanguageSelect = ({ defaultValue, placeholder, disabled, onChange, ...props }) => {

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

    const options = languageOptions.map((item) => (
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
            withinPortal={true}
            onOptionSubmit={(val) => {
                onChange && onChange(val);
                combobox.updateSelectedOptionIndex('active');
                combobox.closeDropdown();
            }}
            disabled={disabled}
        >
            <Combobox.Target targetType="button">
                <InputBase
                    disabled={disabled}
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {defaultValue && languageOptions.find(x => x.value == defaultValue)?.label || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

LanguageSelect.propTypes = {
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};


export default LanguageSelect;
