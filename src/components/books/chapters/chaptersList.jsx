
// 3rd party libraries
import { List, Skeleton } from 'antd';

// Internal Imports
import { useGetBookChaptersQuery } from '../../../features/api/booksSlice';
import Error from '../../common/error';
import ChapterListItem from './chapterListItem';

// ------------------------------------------------------

const ChaptersList = ({libraryId, bookId, t, selectedChapterNumber = null, size = 'default', hideTitle = false }) => {
    const { data : chapters, error, isFetching } = useGetBookChaptersQuery({libraryId, bookId}, { skip : !libraryId || !bookId })

    if (error) return (<Error t={t} />)

    const title = hideTitle ? null : (<div>{t('book.chapters.title')}</div>)

    if (isFetching) return <Skeleton />

    return (<List
            size={size}
            itemLayout="vertical"
            dataSource={chapters ? chapters.data : []}
            header={title}
            renderItem={(chapter) => (
                <ChapterListItem key={chapter.id} selected={selectedChapterNumber === chapter.chapterNumber} libraryId={libraryId} bookId={bookId} chapter={chapter} />
            )}
        />);
}

export default ChaptersList;
