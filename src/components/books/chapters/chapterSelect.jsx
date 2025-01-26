import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Ui Library Import
import { Group, Combobox, useCombobox, Loader, TextInput } from "@mantine/core";

// Local imports
import { useGetBookChaptersQuery, useAddChapterMutation } from '@/store/slices/books.api'
import If from '@/components/if';
import { IconAdd } from '@/components/icons';
import { error, success } from '@/utils/notifications';
//------------------------------------

const ChapterSelect = ({ t, libraryId, bookId, defaultValue = null, onChange, label, placeholder, disabled, ...props }) => {
    const [value, setValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // create new chapter
    //-------------------------------------------------
    //libraryId, bookId, payload
    const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();

    // Fetach data and set the dropdown
    //-------------------------------------------------
    const { data: chapters, error: errorLoading, isFetching } = useGetBookChaptersQuery({ libraryId, bookId })

    const data = useMemo(() => chapters?.data ? chapters.data : [], [chapters]);

    const options = useMemo(() => {
        return data
            .map((chapter) => (
                <Combobox.Option value={chapter.id} key={chapter.id}>
                    <span>{chapter.title}</span>
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
                setValue(addedValue.title);
                onChange(addedValue.id);
                combobox.closeDropdown();
            }
        }

        if (val === '$create') {
            addChapter({
                libraryId, bookId, payload: {
                    title: value
                }
            }).unwrap()
                .then((addedValue) => {
                    setSelection(addedValue);
                })
                .then(() => success({ message: t("chapter.actions.add.success") }))
                .catch((e) => {
                    console.error(e)
                    error({ message: t("chapter.actions.add.error") });
                });
        } else {
            const addedValue = data.find(x => x.id == val);
            if (addedValue) {
                setSelection(addedValue);
            }
        }
    }, [onChange, combobox, addChapter, libraryId, value, t, data]);

    //-------------------------------------------------
    useEffect(() => {
        if (value == null && defaultValue != null && currentValue?.id != defaultValue) {
            const selectedValue = data?.find(x => x.id === defaultValue)

            if (selectedValue) {
                setCurrentValue(selectedValue);
                setValue(selectedValue.title)
            }
        }
    }, [currentValue, data, defaultValue, value]);

    useEffect(() => {
        if (currentValue && value != currentValue.title) {
            setCurrentValue(null)
        }
    }, [value, currentValue]);

    return (
        <Combobox {...props} disabled={disabled} error={errorLoading} store={combobox} onOptionSubmit={handleValueSelect} withinPortal={true}>
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
                            <Combobox.Empty>{t('chapters.empty.title')}</Combobox.Empty>
                        </If>
                        <If condition={options.length < 1 && value && value.trim().length !== 0 && !currentValue} >
                            <Combobox.Option value="$create"><Group gap="sm" wrap='nowrap'>
                                <IconAdd height={24} />
                                <span>{t('cahpter.actions.add.label')}</span>
                            </Group>
                            </Combobox.Option>
                        </If>
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

ChapterSelect.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    bookId: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.any,
    placeholder: PropTypes.any,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.number
};

export default ChapterSelect;