import React from 'react';

// 3rd party libraries
import { Select } from 'antd';

// local imports
import { useGetCategoriesQuery } from '/src/store/slices/categoriesSlice'

// -------------------------------------------------

const CategoriesSelect = ({ libraryId, value = [], onChange, placeholder }) => {
    const { data: categories, error, isFetching } = useGetCategoriesQuery({ libraryId })
    const onChangeHandler = (val) => {
        onChange(categories.data.filter((cat) => val.indexOf(cat.id) > -1))
    }

    return (<Select mode="multiple" loading={isFetching} error={error}
        filterOption optionFilterProp="children"
        defaultValue={value ? value.map(c => c.id) : ""}
        onChange={onChangeHandler} placeholder={placeholder}>
        {categories && categories.data.map((category) => (
            <Select.Option key={category.id} value={category.id}>
                {category.name}
            </Select.Option>
        ))}
    </Select>);
};

export default CategoriesSelect;
