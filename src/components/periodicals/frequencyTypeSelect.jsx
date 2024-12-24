import PropTypes from 'prop-types';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { PeriodicalFrequency } from '@/models';
import { IconTick } from '@/components/icon';
// -------------------------------------------------

const FrequencyTypeSelect = ({ t, defaultValue, placeholder, onChange, ...props }) => {

    const frequencyTypeOptions = [
        { value: PeriodicalFrequency.Annually, label: t('periodical.frequency.annually') },
        { value: PeriodicalFrequency.Quarterly, label: t('periodical.frequency.quarterly') },
        { value: PeriodicalFrequency.Monthly, label: t('periodical.frequency.monthly') },
        { value: PeriodicalFrequency.Fortnightly, label: t('periodical.frequency.fortnightly') },
        { value: PeriodicalFrequency.Weekly, label: t('periodical.frequency.weekly') },
        { value: PeriodicalFrequency.Daily, label: t('periodical.frequency.daily') }
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

    const options = frequencyTypeOptions.map((item) => (
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
                    {defaultValue && frequencyTypeOptions.find(x => x.value == defaultValue)?.label || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

FrequencyTypeSelect.propTypes = {
    t: PropTypes.any,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};


export default FrequencyTypeSelect;
