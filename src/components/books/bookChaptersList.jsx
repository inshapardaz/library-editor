import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// UI library imports
import {
    Avatar,
    Center,
    List,
    Skeleton,
    Space,
    Stack,
    Text,
    Title,
    rem
} from '@mantine/core';
import { useGetBookChaptersQuery } from '@/store/slices/books.api';
import Error from '@/components/error';
//------------------------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);

const BookChaptersList = ({ libraryId, book, isLoading }) => {
    const { t } = useTranslation();
    const {
        data: chapters,
        error: errorLoadingChapters,
        isFetching: loadingChapters,
        refetch
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book?.id
    }, { skip: isLoading === false || !libraryId || book === null || book?.id === null });

    if (isLoading === true || loadingChapters) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (errorLoadingChapters) {
        return (<Error title={t('book.error.loading.title')}
            detail={t('book.error.loading.detail')}
            onRetry={refetch} />)
    }


    if (!chapters || !chapters.data || chapters.data.length < 1) {
        return (<Center h={100}><Text>{t('book.chapterCount', { count: 0 })}</Text></Center>);
    }

    return (<Stack>
        <Title order={3}>{t('book.chapters')}</Title>
        <Space h="md" />
        <List size="lg" spacing="md"> {chapters.data.map((chapter =>
            <List.Item key={chapter.id}
                icon={
                    <Avatar color="cyan" radius="xl">{chapter.chapterNumber}</Avatar>
                }>
                <Text component={Link} to={`/libraries/${libraryId}/books/${book.id}/ebook?chapter=${chapter.chapterNumber}`}>
                    {chapter.title}
                </Text>
            </List.Item>
        ))}
        </List>
    </Stack>
    );
}

BookChaptersList.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        links: PropTypes.shape({
            image: PropTypes.string,
        }),
        publisher: PropTypes.string,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
    }),
    isLoading: PropTypes.object
};

export default BookChaptersList;