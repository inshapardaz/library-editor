import { useNavigate } from 'react-router-dom';

// 3rd party imports
import { Button, Space, Typography } from "antd";
import { FiEdit } from 'react-icons/fi';

// Local imports
import helpers from "../../helpers";
import { BookCategory } from "./bookCategory";
import { BookSeriesInfo } from "./bookSeriesInfo";
import styles from '../../styles/common.module.scss'
import BookDeleteButton from "./bookDeleteButton";

// -----------------------------------------

// -----------------------------------------
const { Paragraph } = Typography;
// ---------------------------------------------

const BookInfo = ({ libraryId, book, t }) =>
{
    const navigate = useNavigate()
    const cover = (book.links.image
        ? <img className={ styles["book__image--thumbnail"]} src={book.links.image} onError={helpers.setDefaultBookImage} alt={book.title}  />
        : <img className={ styles["book__image--thumbnail"]} src={helpers.defaultBookImage} alt={book.title} />);

    return (<>
        <Space direction='vertical' style={{ width: '100%' }}>
            {cover}
            <Paragraph ellipsis={{ rows: 4, tooltip : book.description }}>
                { book.description }
            </Paragraph>
            { book.yearPublished && t('book.publishLabel', { year: book.yearPublished }) }
            <BookCategory libraryId={libraryId} book={book}/>
            <BookSeriesInfo book={book} t={t} />
            <Button block icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}/edit`)}>{t('actions.edit')}</Button>
            <BookDeleteButton block danger libraryId={libraryId} book={book} t={t} >{t('actions.delete')}</BookDeleteButton>

        </Space>
    </>)
}

export default BookInfo;
