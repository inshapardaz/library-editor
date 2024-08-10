import React, { useRef, useState } from 'react';

// 3rd party libraries
import { Button, Divider, Empty, Input, Select, Space, Tooltip } from "antd";

// local imports
import { FaUser, FaPlus } from "/src/icons";
import { useGetIssueArticlesQuery, useAddIssueArticleMutation } from "/src/store/slices/issueArticlesSlice";

// -------------------------------------------------

const IssueArticleSelect = ({
    libraryId,
    issue,
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

    const [addIssueArticle, { isLoading: isAdding }] = useAddIssueArticleMutation();
    const {
        data: articles,
        error,
        isFetching,
    } = useGetIssueArticlesQuery({
        libraryId,
        periodicalId: issue.periodicalId,
        volumeNumber: issue.volumeNumber,
        issueNumber: issue.issueNumber,
        pageNumber: 1,
        pageSize: 10,
    });

    const addNewArticle = (e) => {
        addIssueArticle({
            libraryId,
            periodicalId: issue.periodicalId,
            volumeNumber: issue.volumeNumber,
            issueNumber: issue.issueNumber,
            payload: {
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
                        <Button type="text" icon={<FaPlus />} onClick={addNewArticle} disabled={isAdding || !name} />
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
            {articles &&
                articles.data.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                    </Select.Option>
                ))}
        </Select>
    );
};

export default IssueArticleSelect;
