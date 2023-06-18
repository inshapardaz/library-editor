import { Link } from 'react-router-dom';

// 3rd Party Libraries
import { Card, Typography } from 'antd'
import { FiLayers } from 'react-icons/fi';
import { SlCalender } from 'react-icons/sl';

// Local Imports
import styles from '../../styles/common.module.scss'
import helpers from '../../helpers/index';
import { IconText } from '../common/iconText';
// ------------------------------------------------------

const {Text, Paragraph} = Typography;

// ------------------------------------------------------

function PeriodicalCard({ libraryId, periodical, t })
{

  const cover = (periodical.links.image ? <img src={periodical.links.image} onError={helpers.setDefaultPeriodicalImage} className={ styles["periodical__image"]} alt={periodical.title}  /> :
            <img src={helpers.defaultPeriodicalImage} className={ styles["periodical__image"]}  alt={periodical.title} />);

  const description = periodical.description ? (<Paragraph ellipsis>{periodical.description}</Paragraph>)
                  :(<Text type="secondary">{t('book.noDescription')}</Text>);
  const issueCount = (<Link to={`/libraries/${libraryId}/periodicals/${periodical.id}`}>
    <IconText icon={FiLayers} text={t('periodical.issueCount', { count: periodical.issueCount })} key="book-chapter-count" />
    </Link>);
  const frequency = (<IconText icon={SlCalender} text={t(`periodical.frequency.${periodical.frequency.toLowerCase()}`, { count: periodical.frequency })} key="book-page-count" />);


  return (<Link to={`/libraries/${libraryId}/periodicals/${periodical.id}`}>
    <Card key={periodical.id} cover={cover} hoverable actions={[issueCount, frequency]}>
      <Card.Meta
          title={periodical.title}
          description={description}
      />
    </Card>
  </Link>);
}

export default PeriodicalCard;
