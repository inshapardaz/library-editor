import React from 'react';
import { Link } from 'react-router-dom';

// 3rd Party Libraries
import { List, Typography } from 'antd'
import { ImBooks } from 'react-icons/im';

// Local Imports
import styles from '../../styles/common.module.scss'
import helpers from '../../helpers/index';
import { IconText } from '../common/iconText';

// ------------------------------------------------------

const {Text, Paragraph} = Typography;

// ------------------------------------------------------

function SeriesListItem({ libraryId, series, t })
{
  const avatar = (<img src={series.links.image || helpers.defaultSeriesImage}
    onError={helpers.setDefaultSeriesImage} className={ styles["series__image--small"]} alt={series.title}  />);
  const title = (<Link to={`/libraries/${libraryId}/series/${series.id}`}>{series.name}</Link>);
  const description = series.description ? (<Paragraph ellipsis type="secondary">{series.description}</Paragraph>)
                  :(<Text type="secondary">{t('series.noDescription')}</Text>);
  const bookCount = (<Link to={`/libraries/${libraryId}/series/${series.id}`}>
      <IconText icon={ImBooks} text={t('series.bookCount', { count: series.bookCount })} key="auhtor-book-count" />
      </Link>);

  return (<List.Item key={series.id} actions={[ bookCount ]}>
        <List.Item.Meta title={title} avatar={avatar} description={description} />
    </List.Item>);
}

export default SeriesListItem;
