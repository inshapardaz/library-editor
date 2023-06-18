import React from 'react';
import { Link } from 'react-router-dom';

// 3rd Party Libraries
import { List, Typography } from 'antd'
import { ImBooks } from 'react-icons/im';
import { FaPenFancy } from 'react-icons/fa';

// Local Imports
import styles from '../../styles/common.module.scss'
import helpers from '../../helpers/index';
import { IconText } from '../common/iconText';

// ------------------------------------------------------

const {Text, Paragraph} = Typography;

// ------------------------------------------------------

function AuthorListItem({ libraryId, author, t })
{
  const avatar = (<img src={author.links.image || helpers.defaultAuthorImage}
    onError={helpers.setDefaultAuthorImage} className={ styles["author__image--small"]} alt={author.name}  />);
  const title = (<Link to={`/libraries/${libraryId}/authors/${author.id}`}>{author.name}</Link>);
  const description = author.description ? (<Paragraph ellipsis type="secondary">{author.description}</Paragraph>)
                  :(<Text type="secondary">{t('author.noDescription')}</Text>);
  const bookCount = (<Link to={`/libraries/${libraryId}/authors/${author.id}`}>
      <IconText icon={ImBooks} text={t('author.bookCount', { count: author.bookCount })} key="auhtor-book-count" />
      </Link>);
  const writingsCount = (<Link to={`/libraries/${libraryId}/writings?author=${author.id}`}>
      <IconText icon={FaPenFancy} text="0" key="author-writings-count" />
      </Link>);

  return (<List.Item key={author.id} actions={[ bookCount, writingsCount ]}>
        <List.Item.Meta title={title} avatar={avatar} description={description} />
    </List.Item>);
}

export default AuthorListItem;
