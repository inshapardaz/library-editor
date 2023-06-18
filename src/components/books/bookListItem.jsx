import { Link } from 'react-router-dom';

// 3rd Party Libraries
import { Avatar, List, Typography } from 'antd'
import { FiLayers } from 'react-icons/fi';
import { AiOutlineCopy } from 'react-icons/ai';

// Local Import
import styles from '../../styles/common.module.scss'
import { AuthorAvatar } from '../author/authorAvatar';
import { BookCategory } from './bookCategory';
import { BookSeriesInfo } from './bookSeriesInfo';
import helpers from '../../helpers/index';
import { IconText } from '../common/iconText';
// ------------------------------------------------------

const {Text, Paragraph} = Typography;

// ------------------------------------------------------

function BookListItem({ libraryId, book, t }) 
{
  const cover = (book.links.image ? <img src={book.links.image} onError={helpers.setDefaultBookImage} className={ styles["book__image--small"]}  alt={book.title}  /> : 
  <img src={helpers.defaultBookImage} className={ styles["book__image--small"]} alt={book.title} />);
  const avatar  = (<Avatar.Group maxCount="2" size="large">
       { book.authors.map(author => (<AuthorAvatar key={author.id} libraryId={libraryId} author={author} t={t}/>))}
    </Avatar.Group>);
  const title = (<Link to={`/libraries/${libraryId}/books/${book.id}`}>{book.title}</Link>);
  const description = book.description ? (<Paragraph type="secondary" ellipsis>{book.description}</Paragraph>)
    :(<Text type="secondary">{t('book.noDescription')}</Text>);
  const chapterCount = (<Link to={`/libraries/${libraryId}/books/${book.id}`}>
    <IconText icon={FiLayers} text={t('book.chapterCount', { count: book.chapterCount })} key="book-chapter-count" />
    </Link>);
  const pageCount = (<IconText icon={AiOutlineCopy} text={t('book.pageCount', { count: book.pageCount })} key="book-page-count" />);

  return (<List.Item 
    key={book.id} 
    actions={[chapterCount, pageCount,
      (<BookCategory key={`${book.id}-action-categories`} justList book={book} />),
      (<BookSeriesInfo key={`${book.id}-action-series`} book={book} t={t}/>)
    ]}
    extra={cover}>
        <List.Item.Meta avatar={avatar}
            title={title}
            description={description}
        />
    </List.Item>);
}

export default BookListItem;
