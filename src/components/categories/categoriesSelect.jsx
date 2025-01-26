import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Ui Library Import
import { Combobox, Group, Loader, Pill, PillsInput, useCombobox } from "@mantine/core";

// Local imports
import { useGetCategoriesQuery } from '@/store/slices/categories.api'
import If from '@/components/if';
//------------------------------------

export function CategoriesSelect({ t, libraryId, defaultValue = [], disabled, onChange, placeholder, ...props }) {
    const [search, setSearch] = useState('');
    const [currentValue, setCurrentValue] = useState([]);
    const [selectedPills, setSelectedPills] = useState([]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    // Fetach data and set the dropdown
    //-------------------------------------------------
    const { data: categories, error, isLoading } = useGetCategoriesQuery({ libraryId })

    const data = useMemo(() => categories?.data ? categories.data : [], [categories]);

    const options = useMemo(() => {
        return data
            .filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
            .filter(item => !currentValue.find(x => x.id == item.id))
            .map((cat) => (
                <Combobox.Option value={cat.id} key={cat.id}>
                    <Group gap="sm">
                        <span>{cat.name}</span>
                    </Group>
                </Combobox.Option>
            ));
    }, [data, search, currentValue]);

    //-------------------------------------------------

    // Adding new value
    const handleValueSelect = useCallback((val) => {
        const addedValue = data.find(x => x.id == val);

        if (!currentValue.includes(x => x.id == val)) {
            const newCurrent = [...currentValue, addedValue]
            setCurrentValue(newCurrent);
            onChange(newCurrent)
        }

        setSearch('');
    }, [currentValue, data, onChange]);

    // Removing value
    const handleValueRemove = useCallback((val) => {
        const newCurrent = currentValue.filter((v) => v.id !== val.id)
        setCurrentValue(newCurrent);
        onChange(newCurrent)
    }, [currentValue, onChange]);

    //-------------------------------------------------

    useEffect(() => {
        setCurrentValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        setSelectedPills(currentValue.map((item) => (
            <Pill key={item.id} withRemoveButton onRemove={() => handleValueRemove(item)}>
                {item.name}
            </Pill>
        )))
    }, [currentValue, handleValueRemove]);

    return (
        <Combobox {...props} error={error} disabled={disabled} store={combobox} onOptionSubmit={handleValueSelect} withinPortal={true}>
            <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()} rightSection={<Combobox.Chevron />}>
                    <Pill.Group>
                        {selectedPills}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                disabled={disabled}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder={selectedPills.length < 1 ? placeholder : null}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0) {
                                        event.preventDefault();
                                        handleValueRemove(currentValue[currentValue.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <If condition={!isLoading} elseChildren={<Loader />}>
                        {options.length > 0 ? options : <Combobox.Empty>{t('categories.empty.title')}</Combobox.Empty>}
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

CategoriesSelect.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.any,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        }))
};

export default CategoriesSelect;
