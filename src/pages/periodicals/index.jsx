import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { ImNewspaper } from 'react-icons/im';

// Local Imports
import PageHeader from '../../components/layout/pageHeader';
import PeriodicalsList from '../../components/periodicals/periodicalsList';
import ContentsContainer from '../../components/layout/contentContainer';

function PeriodicalsHomePage() {
  const { t } = useTranslation()
  const { libraryId } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const pageNumber = searchParams.get('pageNumber')
  const pageSize = searchParams.get('pageSize')

  return (<>
    <PageHeader title={t('periodicals.title')} icon={<ImNewspaper style={{ width: 36, height: 36 }}/>} />
    <ContentsContainer>
      <PeriodicalsList libraryId={libraryId}
        query={query}
        pageNumber={pageNumber}
        pageSize={pageSize}
        />
      </ContentsContainer>
  </>);
}
export default PeriodicalsHomePage;
