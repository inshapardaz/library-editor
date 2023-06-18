import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { ImBooks } from 'react-icons/im';

// Local Imports
import PageHeader from '../../components/layout/pageHeader';
import SeriesList from '../../components/series/seriesList';
import ContentsContainer from '../../components/layout/contentContainer';

function SeriesHomePage() {
  const { t } = useTranslation()
  const { libraryId } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const pageNumber = searchParams.get('pageNumber')
  const pageSize = searchParams.get('pageSize')

  return (<>
    <PageHeader title={t('series.title')} icon={<ImBooks style={{ width: 36, height: 36 }}/>} />
    <ContentsContainer>
      <SeriesList libraryId={libraryId} 
        query={query}
        pageNumber={pageNumber}
        pageSize={pageSize}
        />
      </ContentsContainer>
  </>);
}
export default SeriesHomePage;