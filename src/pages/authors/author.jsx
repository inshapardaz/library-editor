import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { Col, Layout, Row } from 'antd';
import { FaFeatherAlt } from 'react-icons/fa';

// Local Imports
import { useGetAuthorByIdQuery } from '../../features/api/authorsSlice';
import PageHeader from '../../components/layout/pageHeader';
import BooksList from '../../components/books/booksList';
import ContentsContainer from '../../components/layout/contentContainer';
import Loading from '../../components/common/loader';
import Error from '../../components/common/error';
import AuthorInfo from '../../components/author/authorInfo';

 //--------------------------------------------------------
 const {  Content } = Layout;
 //--------------------------------------------------------

function AuthorPage() {
  const { t } = useTranslation()
  const { libraryId, authorId } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const status = searchParams.get('status')
  const sortBy = searchParams.get('sortBy') ?? 'DateCreated'
  const sortDirection = searchParams.get('sortDirection') ?? 'descending'
  const pageNumber = searchParams.get('pageNumber') ?? 1
  const pageSize = searchParams.get('pageSize') ?? 12

  const { data : author, error, isFetching } = useGetAuthorByIdQuery({libraryId, authorId})

  if (isFetching) return <Loading />
  if (error) return (<Error />)

  return (<>
    <PageHeader title={author.name} icon={<FaFeatherAlt style={{ width: 36, height: 36 }}/>} />
    <ContentsContainer>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <Row gutter={16}>
              <Col span={6}>
                  <AuthorInfo libraryId={libraryId} author={author} t={t} />
              </Col>
              <Col span={18}>
                <BooksList libraryId={libraryId}
                  query={query}
                  author={authorId}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  status={status}
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  />
              </Col>
            </Row>
          </Content>
      </ContentsContainer>
  </>);
}
export default AuthorPage;
