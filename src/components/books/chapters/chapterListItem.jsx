import { Link } from 'react-router-dom';

// 3rd Party Libraries
import { Avatar, List, Typography } from 'antd'

// Local Import

// ------------------------------------------------------

function ChapterListItem({ libraryId, bookId, chapter, selected = false })
{
  const title = selected ?  (<Typography.Text disabled={true}>{chapter.title}</Typography.Text>) :
    (<Link to={`/libraries/${libraryId}/books/${bookId}/chapters/${chapter.chapterNumber}`}>
      <Typography.Text>{chapter.title}</Typography.Text>
    </Link>);
  return (<List.Item>
      <List.Item.Meta
        title={title}
        avatar={<Avatar>{chapter.chapterNumber}</Avatar>} />
    </List.Item>);
}

export default ChapterListItem;
