import PropTypes from 'prop-types';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { AuthorTypes } from '@/models';
import { IconTick } from '@/components/icons';
// -------------------------------------------------

const AuthorTypeSelect = ({ t, defaultValue, placeholder, onChange, ...props }) => {

    const authorTypeOptions = [
        { value: AuthorTypes.Writer, label: t('author.type.writer') },
        { value: AuthorTypes.Poet, label: t('author.type.poet') }
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

    const options = authorTypeOptions.map((item) => (
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
                    {defaultValue && authorTypeOptions.find(x => x.value == defaultValue)?.label || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

AuthorTypeSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};


export default AuthorTypeSelect;
