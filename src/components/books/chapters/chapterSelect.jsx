import React, { useRef, useState } from 'react';

// 3rd party libraries
import { Button, Divider, Empty, Input, Select, Space, Tooltip } from "antd";

// local imports
import { FaUser, FaPlus } from "/src/icons";
import { useGetBookChaptersQuery, useAddChapterMutation } from "/src/store/slices/booksSlice";

// -------------------------------------------------

const ChapterSelect = ({
    libraryId,
    book,
    label,
    value,
    onChange,
    placeholder,
    t,
    showAdd
}) => {
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();
    const {
        data: chapters,
        error,
        isFetching,
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book.id,
        pageNumber: 1,
        pageSize: 10,
    });

    const addNewChapter = (e) => {
        addChapter({
            libraryId, bookId: book.id, payload: {
                title: name
            }
        })
            .unwrap()
            .then(() => {
                setName('');
            });
        e.preventDefault();
    }

    const renderDropDown = (menu) => {
        if (!showAdd)
            return menu;
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
                        placeholder={t('chapter.title.label')}
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                        disabled={isAdding}
                    />
                    <Tooltip title={t('chapter.actions.add.label')} >
                        <Button type="text" icon={<FaPlus />} onClick={addNewChapter} disabled={isAdding || !name} />
                    </Tooltip>
                </Space.Compact>
            </>
        )
    }

    const onChangeHandler = (v) => onChange(v);

    return (
        <Select
            loading={isFetching}
            error={error}
            defaultValue={{ value, label }}
            defaultActiveFirstOption={false}
            onChange={onChangeHandler}
            placeholder={placeholder}
            dropdownRender={renderDropDown}
            notFoundContent={
                <Empty
                    image={<FaUser size="2em" />}
                    description={t("chapters.empty.title")}
                />
            }
        >
            {chapters &&
                chapters.data.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                    </Select.Option>
                ))}
        </Select>
    );
};

export default ChapterSelect;
