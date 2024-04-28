import { Link } from 'react-router-dom';

// 3rd party
import { Space, Tag } from 'antd';
import { FaTags } from 'react-icons/fa';

// ------------------------------------------------

export default ArticleCategory = ({ libraryId, article }) => {
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
}
