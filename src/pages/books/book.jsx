import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

// 3rd party libraries
import { Col, Row } from "antd"
import { ImBooks } from "react-icons/im"

// Local imports
import { useGetBookQuery } from "../../features/api/booksSlice"
import ContentsContainer from "../../components/layout/contentContainer"
import PageHeader from "../../components/layout/pageHeader"
import BookInfo from "../../components/books/bookInfo"
import ChaptersList from "../../components/books/chapters/chaptersList"
import Error from "../../components/common/error"
import Loading from "../../components/common/loader"
// ----------------------------------------------

const BookPage = () => {
    const { t } = useTranslation()
    const { libraryId, bookId } = useParams()
    const { data : book, error, isFetching } = useGetBookQuery({libraryId, bookId}, { skip : !libraryId || !bookId })

    if (isFetching) return <Loading />
    if (error) return (<Error />)

    return (<>
        <PageHeader title={book.title} icon={<ImBooks style={{ width: 36, height: 36 }} />} />
        <ContentsContainer>
          <Row gutter={16}>
                <Col l={4} md={6} xs={24}>
                  <BookInfo libraryId={libraryId} book={book} t={t} />
                </Col>
                <Col l={20} md={18} xs={24}>
                    <ChaptersList libraryId={libraryId} bookId={bookId} t={t} size="large" />
                </Col>
          </Row>
        </ContentsContainer>
    </>)
}

export default BookPage
