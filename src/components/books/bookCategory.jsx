import React from 'react';
import { Link } from 'react-router-dom';

// 3rd party
import { Space, Tag } from 'antd';
import { FaTags } from 'react-icons/fa';

// ------------------------------------------------

const BookCategory = ({ libraryId, book }) => {
    if (book && book.categories && book.categories.length > 0) {
        const list = book.categories.map(c => (<Tag key={c.id}>
            <Link to={`/libraries/${libraryId}/books?categories=${c.id}`}>{c.name}</Link>
        </Tag>));

        return (<Space wrap align="start">
            <FaTags />
            {list}
        </Space>);
    }

    return null;
};

export default BookCategory;
