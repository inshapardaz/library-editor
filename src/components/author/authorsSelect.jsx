import React, { useState }  from 'react';

// 3rd party libraries
import { Avatar, Empty, Select, Space } from 'antd';
import { FaFeatherAlt } from 'react-icons/fa';

// local imports
import { useGetAuthorsQuery } from '../../features/api/authorsSlice'
import helpers from '../../helpers';
// -------------------------------------------------

const AuthorAvatar = ({author}) => author.links.image
            ? <Avatar src={author.links.image}></Avatar>
            : <Avatar src={helpers.defaultAuthorImage}></Avatar>;

// -------------------------------------------------

const AuthorsSelect = ({ libraryId, value = [], onChange, placeholder, t }) => {
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
        notFoundContent={<Empty image={<FaFeatherAlt size="2em"/>} description={t('authors.empty.title')} />}
        placeholder={placeholder}>
        {authors != null && authors.data.map((author) => (
        <Select.Option key={author.id} value={author.id}>
          <Space>
                <AuthorAvatar author={author} />
                { author.name }
            </Space>
        </Select.Option>
      ))}
    </Select>);
};

export default AuthorsSelect;
