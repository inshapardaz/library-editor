import { Link } from 'react-router-dom';

// 3rd party
import { Space, Tag } from 'antd';
import { FaTags } from 'react-icons/fa';

// ------------------------------------------------

export function PeriodicalCategory({ libraryId, periodical }) {
  if (periodical && periodical.categories && periodical.categories.length > 0)
  {
    const list = periodical.categories.map(c => (<Tag key={c.id}>
      <Link to={`/libraries/${libraryId}/periodicals?categories=${c.id}`}>{c.name}</Link>
    </Tag>));

    return (<Space wrap align="start">
      <FaTags />
      {list}
    </Space>);
  }

  return null;
}
