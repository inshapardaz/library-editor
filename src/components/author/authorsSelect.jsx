import React, { useRef, useState } from 'react';

// 3rd party libraries
import { Avatar, Button, Divider, Empty, Input, Select, Space, Tooltip } from 'antd';

// local imports
import { FaFeatherAlt, FaPlus } from '/src/icons';
import { useGetAuthorsQuery, useAddAuthorMutation } from '/src/store/slices/authorsSlice'
import { authorPlaceholderImage } from '/src/util';
// -------------------------------------------------

const AuthorAvatar = ({ author }) => author.links.image
    ? <Avatar src={author.links.image}></Avatar>
    : <Avatar src={authorPlaceholderImage}></Avatar>;

// -------------------------------------------------

const AuthorsSelect = ({ libraryId, value = [], onChange, placeholder, t, showAdd }) => {
    const [query, setQuery] = useState('')
    const [name, setName] = useState('');
    const [type, setType] = useState('Writer');
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const [addAuthor, { isLoading: isAdding }] = useAddAuthorMutation();
    const { data: authors, error, isFetching } = useGetAuthorsQuery({ libraryId, query, pageNumber: 1, pageSize: 10 })
    const onChangeHandler = (val) => {
        onChange(val.map(v => ({ id: v })))
    }

    const onSearchHandler = (val) => {
        setQuery(val)
    }

    const addNewAuthor = (e) => {
        addAuthor({
            libraryId, payload: {
                name: name,
                authorType: type
            }
        })
            .unwrap()
            .then(() => {
                setName('');
                setType('Writer')
            });
        e.preventDefault();
    }

    const renderDropDown = (menu) => {
        if (!showAdd)
            return menu;

        const selectBefore = (
            <Select size='small' placeholder={t("author.type.placeholder")}
                defaultValue={type}
                onSelect={value => setType(value)}
                onClick={e => e.preventDefault()}>
                <Select.Option value="Writer">{t("author.type.writer")}</Select.Option>
                <Select.Option value="Poet">{t("author.type.poet")}</Select.Option>
            </Select>
        );

        return (
            <>
                {menu}
                <Divider
                    style={{
                        margin: '8px 0',
                    }}
                />
                <Space.Compact
                    style={{
                        width: '100%',
                    }}
                >
                    <Input
                        placeholder={t('author.name.label')}
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                        disabled={isAdding}
                        addonAfter={selectBefore}
                    />
                    <Tooltip title={t('author.actions.add.title')} >
                        <Button type="text" icon={<FaPlus />} onClick={addNewAuthor} disabled={isAdding || !name} />
                    </Tooltip>
                </Space.Compact>
            </>
        )
    }


    return (<Select mode="multiple" loading={isFetching}
        error={error}
        filterOption={false}
        defaultValue={value ? value.map(a => ({ value: a.id, label: a.name })) : ""}
        onSearch={onSearchHandler}
        onChange={onChangeHandler}
        dropdownRender={renderDropDown}
        notFoundContent={<Empty image={<FaFeatherAlt size="2em" />} description={t('authors.empty.title')} />}
        placeholder={placeholder}>
        {authors != null && authors.data.map((author) => (
            <Select.Option key={author.id} value={author.id}>
                <Space>
                    <AuthorAvatar author={author} />
                    {author.name}
                </Space>
            </Select.Option>
        ))}
    </Select>);
};

export default AuthorsSelect;
