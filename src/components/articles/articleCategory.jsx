import React from 'react';
import { Link } from 'react-router-dom';

// 3rd party
import { Space, Tag } from 'antd';

// Local Imports
import { FaTags } from '/src/icons';

// ------------------------------------------------

const ArticleCategory = ({ libraryId, article }) => {
    if (article && article.categories && article.categories.length > 0) {
        const list = article.categories.map(c => (<Tag key={c.id}>
            <Link to={`/libraries/${libraryId}/articles?categories=${c.id}`}>{c.name}</Link>
        </Tag>));

        return (<Space wrap align="start">
            <FaTags />
            {list}
        </Space>);
    }

    return null;
};

export default ArticleCategory;
