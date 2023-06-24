import React, { useState }  from 'react';

// 3rd party libraries
import { Select } from 'antd';

// local imports
import { useGetSeriesQuery } from '../../features/api/seriesSlice'

// -------------------------------------------------

const SeriesSelect = ({ libraryId, label, value, onChange, placeholder }) => {
    const [query, setQuery] = useState('')
    const { data: series, error, isFetching } = useGetSeriesQuery({ libraryId, query, pageNumber: 1, pageSize: 10})
    const onChangeHandler = (v) => onChange(v)
    const onSearchHandler = (v) => setQuery(v)

    const options = series ? series.data.map(s => ({ value: s.id, label: s.name })) : []
    return (<Select showSearch
        placeholder={placeholder}
        loading={isFetching}
        error={error}
        defaultValue={({ value, label })}
        defaultActiveFirstOption={false}
        filterOption={false}
        notFoundContent={null}
        onSearch={ onSearchHandler }
        onChange={ onChangeHandler }
        options={options} />);
};

export default SeriesSelect;
