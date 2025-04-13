import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Ui Library Import
import { Combobox, useCombobox, Loader, useMantineTheme, TextInput } from "@mantine/core";

// Local imports
import { useGetWritersQuery } from '@/store/slices/accounts.api'
import { IconError } from '@/components/icons';
import If from '@/components/if';

//------------------------------------

const NoneValue = "none";
const MeValue = "me";
// eslint-disable-next-line no-unused-vars
const UserSelect = ({ t, libraryId, defaultValue = null, onChange, addMeOption = false, label, value, placeholder, ...props }) => {
    const theme = useMantineTheme();
    const [search, setSearch] = useState(null);
    const [hasSelectedOption, setHasSelectedOption] = useState(false);
    const [currentValue, setCurrentValue] = useState(null);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // Fetach data and set the dropdown
    //-------------------------------------------------
    const {
        data: writers,
        error,
        isFetching,
    } = useGetWritersQuery({ libraryId, query: search, pageNumber: 1, pageSize: 10 },
        { skip: hasSelectedOption });

    const data = useMemo(() => writers ? writers : [], [writers]);

    const options = useMemo(() => {
        return data
            .map((user) => (
                <Combobox.Option value={user.id} key={user.id}>
                    <span>{user.name}</span>
                </Combobox.Option>
            ));
    }, [data]);

    //-------------------------------------------------

    const handleValueSelect = useCallback((val) => {
        const selectedValue = val === NoneValue || val === MeValue ? { id: val, name: val === MeValue ? t("users.me.title") : t("users.none.title") } : data.find(x => x.id == val)
        if (selectedValue) {
            setCurrentValue({ id: selectedValue.id, value: selectedValue.name });
            setSearch(selectedValue.name);
            onChange(selectedValue.id);
            combobox.updateSelectedOptionIndex();
            combobox.closeDropdown();
            setHasSelectedOption(true);
        } else {
            setHasSelectedOption(false);
        }
    }, [t, data, onChange, combobox]);

    //-------------------------------------------------
    useEffect(() => {
        if (search == null && defaultValue != null && currentValue?.id != defaultValue) {
            const selectedValue = data?.find(x => x.id === defaultValue)

            if (selectedValue || search === NoneValue || search === MeValue) {
                setCurrentValue(selectedValue);
                setSearch(selectedValue.name)
            }
        }
    }, [currentValue, data, defaultValue, search]);

    useEffect(() => {
        if (currentValue && search != currentValue.name) {
            setCurrentValue(null)
        }
    }, [search, currentValue]);

    return (
        <Combobox shadow='md' {...props} store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.Target>
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    value={search || ''}
                    onChange={(event) => {
                        setSearch(event.currentTarget.value);
                        combobox.openDropdown();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    leftSection={error && <IconError style={{ color: theme.colors.red[7] }} />}
                    rightSection={<Combobox.Chevron />}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <If condition={!isFetching} elseChildren={<Loader />}>
                        <Combobox.Option key={NoneValue} value={NoneValue}>
                            <span>{t("users.none.title")}</span>
                        </Combobox.Option>
                        <If condition={addMeOption}>
                            <Combobox.Option key={MeValue} value={MeValue}>
                                <span>{t("users.me.title")}</span>
                            </Combobox.Option>
                        </If>
                        {/* When items found from sewrver  */}
                        <If condition={options.length > 0}>
                            <Combobox.Group label={t("users.others.title")}>
                                {options}
                            </Combobox.Group>
                        </If>
                        {/* When no items found  and no search */}
                        <If condition={options.length == 0 && search?.trim().length === 0} >
                            <Combobox.Empty>{t('users.empty')}</Combobox.Empty>
                        </If>
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox >
    );
}

UserSelect.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.any,
    placeholder: PropTypes.any,
    addMeOption: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.number
};

export default UserSelect;