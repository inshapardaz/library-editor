import { Typography } from 'antd';
// ------------------------------------------------------

const { Text } = Typography;

// ------------------------------------------------------

export function BookSeriesInfo({ book, t }) {
  if (book && book.seriesName) {
    if (book.seriesIndex && book.seriesIndex > 0) {
      return (<Text type='secondary'>{t('book.seriesAndIndex', { name: book.seriesName, index: book.seriesIndex })}</Text>);
    }

    else {
      return (<Text type='secondary'>{t('book.series', { name: book.seriesName })}</Text>);
    }
  }

  return null;
}
