import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// 3rd party libraries
import { Group, Avatar, Combobox, useCombobox, Loader, Pill, PillsInput, useMantineTheme } from "@mantine/core";

// local imports
import { IconAuthor, IconAdd, IconError } from '@/components/icons';
import { useGetAuthorsQuery, useAddAuthorMutation } from '@/store/slices/authors.api'
import If from '@/components/if';
import { error, success } from '@/utils/notifications';
// -------------------------------------------------

const AuthorPill = ({ author, onRemove }) => {
    if (!author) {
        return null;
    }

    return (
        <Pill withRemoveButton onRemove={onRemove} size="md">
            <Group gap="sm" wrap='nowrap'>
                <Avatar size="sm" src={author.links?.image || <IconAuthor />} />
                <span>{author.name}</span>
            </Group>
        </Pill>
    );
};

AuthorPill.propTypes = {
    onRemove: PropTypes.func,
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        bookCount: PropTypes.number,
        articleCount: PropTypes.number,
        poetryCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

//------------------------------------

const AuthorsSelect = ({ t, libraryId, defaultValue = [], disabled, onChange, showAdd = false, placeholder, ...props }) => {
    const theme = useMantineTheme();
    const [search, setSearch] = useState('');
    const [currentValue, setCurrentValue] = useState([]);
    const [selectedPills, setSelectedPills] = useState([]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    // create new author
    //-------------------------------------------------
    const [addAuthor, { isLoading: isAdding, error: addingFailed }] = useAddAuthorMutation();

    // Fetach data and set the dropdown
    //-------------------------------------------------
    const { data: authors, isFetching } = useGetAuthorsQuery({ libraryId, query: search, pageNumber: 1, pageSize: 10 })

    const data = useMemo(() => authors?.data ? authors.data : [], [authors]);

    const options = useMemo(() => {
        return data
            .filter(author => author.name.toLowerCase().includes(search.trim().toLowerCase()))
            .filter(author => !currentValue.find(x => x.id == author.id))
            .map((author) => (
                <Combobox.Option value={author.id} key={author.id}>
                    <Group gap="sm" wrap='nowrap'>
                        <Avatar src={author.links?.image || <IconAuthor />} />
                        <span>{author.name}</span>
                    </Group>
                </Combobox.Option>
            ));
    }, [data, search, currentValue]);

    //-------------------------------------------------

    // Adding new value
    const handleValueSelect = useCallback((val) => {
        setSearch('');

        if (val === '$create') {
            addAuthor({
                libraryId, payload: {
                    name: search,
                    authorType: 'writer'
                }
            }).unwrap()
                .then((addedValue) => {
                    const newCurrent = [...currentValue, addedValue]
                    setCurrentValue(newCurrent);
                    onChange(newCurrent)
                })
                .then(() => {
                    success({ message: t("author.actions.add.success") })
                })
                .catch((e) => {
                    console.error(e)
                    error({ message: t("author.actions.add.error") });
                });
        } else {
            const addedValue = data.find(x => x.id == val);

            if (!currentValue.includes(x => x.id == val)) {
                const newCurrent = [...currentValue, addedValue]
                setCurrentValue(newCurrent);
                onChange(newCurrent)
            }
        }
    }, [addAuthor, currentValue, data, libraryId, onChange, search, t]);

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
        setSelectedPills(currentValue.map((author) => (
            <AuthorPill key={author.id} author={author} onRemove={() => handleValueRemove(author)} />
        )))
    }, [currentValue, handleValueRemove]);

    return (
        <Combobox {...props} disabled={disabled} store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
                <PillsInput
                    onClick={() => combobox.openDropdown()}
                    leftSection={<If condition={addingFailed}><IconError style={{ color: theme.colors.red[7] }} /></If>}
                    rightSection={<Combobox.Chevron />}>
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
                    <If condition={!isFetching && !isAdding} elseChildren={<Loader />}>
                        {/* When items found from sewrver  */}
                        <If condition={options.length > 0}>
                            {options}
                        </If>

                        {/* When no items found  and no search */}

                        <If condition={options.length == 0 && search.trim().length === 0} >
                            <Combobox.Empty>{t('authors.empty')}</Combobox.Empty>
                        </If>
                        <If condition={showAdd && options.length < 1 && search.trim().length !== 0} >
                            <Combobox.Option value="$create"><Group gap="sm" wrap='nowrap'>
                                <IconAdd height={24} />
                                <span>{t('author.actions.add.labelWithName', { name: search })}</span>
                            </Group>
                            </Combobox.Option>
                        </If>
                    </If>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

AuthorsSelect.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.any,
    showAdd: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            bookCount: PropTypes.number,
            articleCount: PropTypes.number,
            poetryCount: PropTypes.number,
            links: PropTypes.shape({
                image: PropTypes.string
            })
        }))
};

export default AuthorsSelect;
