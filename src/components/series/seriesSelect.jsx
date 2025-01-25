import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Ui Library Import
import { Group, Combobox, useCombobox, Loader, TextInput } from "@mantine/core";

// Local imports
import { useGetSeriesQuery, useAddSeriesMutation } from '@/store/slices/series.api'
import If from '@/components/if';
import { IconAdd } from '@/components/icons';
import { error, success } from '@/utils/notifications';
//------------------------------------

const SeriesSelect = ({ t, libraryId, defaultValue = null, onChange, label, placeholder, disabled, ...props }) => {
    const [value, setValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // create new series
    //-------------------------------------------------
    const [addSeries, { isLoading: isAdding }] = useAddSeriesMutation();

    // Fetach data and set the dropdown
    //-------------------------------------------------
    const { data: series, error: errorLoading, isFetching } = useGetSeriesQuery({ libraryId, query: value, pageNumber: 1, pageSize: 10 })

    const data = useMemo(() => series?.data ? series.data : [], [series]);

    const options = useMemo(() => {
        return data
            .map((series) => (
                <Combobox.Option value={series.id} key={series.id}>
                    <span>{series.name}</span>
                </Combobox.Option>
            ));
    }, [data]);

    //-------------------------------------------------

    // Adding new value
    const handleValueSelect = useCallback((val) => {
        setValue('');

        const setSelection = (addedValue) => {
            if (addedValue) {
                setCurrentValue(addedValue);
                setValue(addedValue.name);
                onChange(addedValue.id);
                combobox.closeDropdown();
            }
        }

        if (val === '$create') {
            addSeries({
                libraryId, payload: {
                    name: value
                }
            }).unwrap()
                .then((addedValue) => {
                    setSelection(addedValue);
                })
                .then(() => success({ message: t("series.actions.add.success") }))
                .catch((e) => {
                    console.error(e)
                    error({ message: t("series.actions.add.error") });
                });
        } else {
            const addedValue = data.find(x => x.id == val);
            if (addedValue) {
                setSelection(addedValue);
            }
        }
    }, [onChange, combobox, addSeries, libraryId, value, t, data]);

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
        <Combobox {...props} disabled={disabled} error={errorLoading} store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
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
                    <If condition={!isFetching && !isAdding} elseChildren={<Loader />}>
                        {/* When items found from sewrver  */}
                        <If condition={options.length > 0}>
                            {options}
                        </If>

                        {/* When no items found  and no search */}

                        <If condition={options.length == 0 && value?.trim().length === 0} >
                            <Combobox.Empty>{t('series.empty')}</Combobox.Empty>
                        </If>
                        <If condition={options.length < 1 && value && value.trim().length !== 0 && !currentValue} >
                            <Combobox.Option value="$create"><Group gap="sm" wrap='nowrap'>
                                <IconAdd height={24} />
                                <span>{t('series.actions.add.labelWithName', { name: value })}</span>
                            </Group>
                            </Combobox.Option>
                        </If>
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

SeriesSelect.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.any,
    placeholder: PropTypes.any,
    showAdd: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.number
};

export default SeriesSelect;