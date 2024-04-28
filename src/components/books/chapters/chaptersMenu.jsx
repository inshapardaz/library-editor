
// 3rd party libraries
import { Avatar, Menu, Skeleton } from 'antd';

// Internal Imports
import { useGetBookChaptersQuery } from '~/src/store/slices/booksSlice';
import Error from '~/src/components/common/error';

// ------------------------------------------------------

const ChaptersMenu = ({ libraryId, bookId, t, selectedChapterNumber = null, onChanged }) => {
    const { data: chapters, error, isFetching } = useGetBookChaptersQuery({ libraryId, bookId }, { skip: !libraryId || !bookId })

    if (error) return (<Error t={t} />)

    if (isFetching) return <Skeleton />

    const items = chapters?.data.map(c => ({ key: c.chapterNumber, label: c.title, icon: <Avatar>{c.chapterNumber}</Avatar> }))
    const onClick = ({ key }) => onChanged(key)
    return (<Menu mode="inline" items={items} selectedKeys={selectedChapterNumber} onClick={onClick} />)
}

export default ChaptersMenu;
