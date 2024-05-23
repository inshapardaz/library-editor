import React from 'react';
import { Link } from 'react-router-dom';

// 3rd party
import { Space, Tag } from 'antd';

// Local Imports
import { FaTags } from '/src/icons';

// ------------------------------------------------

const PeriodicalCategory = ({ libraryId, periodical }) => {
    if (periodical && periodical.categories && periodical.categories.length > 0) {
        const list = periodical.categories.map(c => (<Tag key={c.id}>
            <Link to={`/libraries/${libraryId}/periodicals?categories=${c.id}`}>{c.name}</Link>
        </Tag>));

        return (<Space wrap align="start">
            <FaTags />
            {list}
        </Space>);
    }

    return null;
};

export default PeriodicalCategory;
