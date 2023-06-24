import React, { useState }  from 'react';

// 3rd party libraries
import { Select } from 'antd';

// local imports
import { useGetAuthorsQuery } from '../../features/api/authorsSlice'

// -------------------------------------------------

const AuthorsSelect = ({ libraryId, value = [], onChange, placeholder }) => {
    const [query, setQuery] = useState('')
    const { data: authors, error, isFetching } = useGetAuthorsQuery({ libraryId, query, pageNumber: 1, pageSize: 10})
    const onChangeHandler = (val) => {
        onChange(val.map(v => ({ id: v })))
    }

    const onSearchHandler = (val) => {
        setQuery(val)
    }

    return (<Select mode="multiple" loading={isFetching}
        error={error}
        filterOption={false}
        defaultValue={ value ? value.map(a => ({ value: a.id, label: a.name })): "" }
        onSearch={ onSearchHandler }
        onChange={ onChangeHandler }
        placeholder={placeholder}>
        {authors != null && authors.data.map((author) => (
        <Select.Option key={author.id} value={author.id}>
          { author.name }
        </Select.Option>
      ))}
    </Select>);
};

export default AuthorsSelect;
