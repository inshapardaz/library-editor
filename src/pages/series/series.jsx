import { useParams, useSearchParams } from 'react-router-dom';

// 3rd party libraries
import { Layout } from 'antd';
import { ImBooks } from 'react-icons/im';

// Local Imports
import PageHeader from '../../components/layout/pageHeader';
import BooksList from '../../components/books/booksList';
import ContentsContainer from '../../components/layout/contentContainer';
import { useGetSeriesByIdQuery } from '../../features/api/seriesSlice';
import Loading from '../../components/common/loader';
import Error from '../../components/common/error';

 //--------------------------------------------------------
 const {  Content } = Layout;
 //--------------------------------------------------------

function SeriesPage() {
  const { libraryId, seriesId } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const status = searchParams.get('status')
  const sortBy = searchParams.get('sortBy') ?? 'DateCreated'
  const sortDirection = searchParams.get('sortDirection') ?? 'descending'
  const pageNumber = searchParams.get('pageNumber') ?? 1
  const pageSize = searchParams.get('pageSize') ?? 12

  const { data : series, error, isFetching } = useGetSeriesByIdQuery({libraryId, seriesId})

    if (isFetching) return <Loading />
    if (error) return (<Error />)

  return (<>
    <PageHeader title={series.name} icon={<ImBooks style={{ width: 36, height: 36 }}/>} />
    <ContentsContainer>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <BooksList libraryId={libraryId}
            query={query}
            series={seriesId}
            sortBy={sortBy}
            sortDirection={sortDirection}
            status={status}
            pageNumber={pageNumber}
            pageSize={pageSize}
            />
          </Content>
      </ContentsContainer>
  </>);
}
export default SeriesPage;
