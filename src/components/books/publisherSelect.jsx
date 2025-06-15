import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// Ui Library Import
import { Combobox, useCombobox, Loader, TextInput } from "@mantine/core";

// Local imports
import { useGetPublishersQuery } from '@/store/slices/books.api'
import If from '@/components/if';
//------------------------------------

const PublisherAutocomplete = ({ libraryId, defaultValue = null, onChange, label, placeholder, disabled, ...props }) => {
    const [value, setValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // Fetch data and set the dropdown
    //-------------------------------------------------
    const { data: publishers, error: errorLoading, isFetching } = useGetPublishersQuery({ libraryId, query: value, pageNumber: 1, pageSize: 10 })

    const data = useMemo(() => publishers?.data ? publishers.data : [], [publishers]);

    const options = useMemo(() => {
        return data
            .map((publisher) => (
                <Combobox.Option value={publisher} key={publisher}>
                    <span>{publisher}</span>
                </Combobox.Option>
            ));
    }, [data]);

    //-------------------------------------------------
    useEffect(() => {
        if (value == null && defaultValue != null && currentValue?.id != defaultValue) {
            const selectedValue = data?.find(x => x.id === defaultValue)

            if (selectedValue) {
                setCurrentValue(selectedValue);
                setValue(selectedValue.name)
            }
        }
    }, [currentValue, data, defaultValue, value]);

    useEffect(() => {
        if (currentValue && value != currentValue.name) {
            setCurrentValue(null)
        }
    }, [value, currentValue]);

    return (
        <Combobox {...props} disabled={disabled}
            error={errorLoading}
            store={combobox}
            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                onChange(optionValue);
                combobox.closeDropdown();
            }}
            withinPortal={true}>
            <Combobox.Target>
                <TextInput disabled={disabled}
                    label={label}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.updateSelectedOptionIndex();
                        combobox.openDropdown();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={<Combobox.Chevron />}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <If condition={!isFetching} elseChildren={<Loader />}>
                        <If condition={options.length > 0} elseChildren={<Combobox.Empty />}>
                            {options}
                        </If>
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

PublisherAutocomplete.propTypes = {
    libraryId: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.any,
    placeholder: PropTypes.any,
    showAdd: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.number
};

export default PublisherAutocomplete;
