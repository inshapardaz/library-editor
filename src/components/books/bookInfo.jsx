import { Col, Row, Typography } from "antd";
import helpers from "../../helpers";
import { BookCategory } from "./bookCategory";
import { BookSeriesInfo } from "./bookSeriesInfo";
import styles from '../../styles/common.module.scss'


// -----------------------------------------
const { Paragraph } = Typography;
// ---------------------------------------------

const BookInfo = ({ libraryId, book, t }) =>
{

    const cover = (book.links.image
        ? <img className={ styles["book__image--thumbnail"]} src={book.links.image} onError={helpers.setDefaultBookImage} alt={book.title}  />
        : <img className={ styles["book__image--thumbnail"]} src={helpers.defaultBookImage} alt={book.title} />);

    return (<>
        <Row gutter={[8, 32]}>
            <Col span={24}>{ cover }</Col>
            <Col span={24}>
                <Paragraph ellipsis={{ rows: 4, tooltip : book.description }}>
                    { book.description }
                </Paragraph>
            </Col>
            { book.yearPublished && <Col span={24}>
                { t('book.publishLabel', { year: book.yearPublished }) }
            </Col>}
            <Col span={24}>
                <BookCategory libraryId={libraryId} book={book}/>
            </Col>
            <Col span={24}>
                <BookSeriesInfo book={book} t={t} />
            </Col>
        </Row>
    </>)
}

export default BookInfo;
