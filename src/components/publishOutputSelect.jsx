import PropTypes from 'prop-types';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { IconTick } from '@/components/icons';
// -------------------------------------------------

const PublishOutputSelect = ({ t, defaultValue, placeholder, disabled, onChange, ...props }) => {

    const publishOptions = [
        { value: 'None', label: t('book.actions.publish.publishTypes.None') },
        { value: 'application/msword', label: t('book.actions.publish.publishTypes.Word') },
        { value: 'application/epub+zip', label: t('book.actions.publish.publishTypes.Epub') }
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

    const options = publishOptions.map((item) => (
        <Combobox.Option value={item.value} key={item.value} active={item.value === defaultValue}>
            <Group gap="xs">
                {item.value === defaultValue && <IconTick size={12} />}
                <span>{item.label}</span>
            </Group>
        </Combobox.Option>
    ));

    return (
        <Combobox {...props}
            disabled={disabled}
            store={combobox}
            withinPortal={true}
            onOptionSubmit={(val) => {
                onChange && onChange(val);
                combobox.updateSelectedOptionIndex('active');
            }}
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
                    {defaultValue && publishOptions.find(x => x.value == defaultValue)?.label || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

PublishOutputSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};


export default PublishOutputSelect;
