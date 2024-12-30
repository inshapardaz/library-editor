import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui Library
import { Button } from '@mantine/core';

// Local imports
import { useGetBooksQuery } from "@/store/slices/books.api";
import BookCard from './bookCard';
import BookListItem from './bookListItem';
import DataView from '@/components/dataView';
import { updateLinkToBooksPage } from '@/utils';
import SortMenu from '@/components/sortMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import { IconTitle, IconDateCreated, IconSeriesIndex, IconAdd } from '@/components/icons';
import BookFilterMenu from './bookFilterMenu';
//------------------------------

const BooksList = ({
    libraryId,
    query = null,
    author = null,
    category = null,
    series = null,
    sortBy = null,
    sortDirection = null,
    favorite = null,
    read = null,
    status,
    pageNumber,
    pageSize,
    showSearch = true,
    showTitle = true
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        refetch,
        data: books,
        isError,
        isFetching,
    } = useGetBooksQuery({
        libraryId,
        query,
        author,
        category,
        series,
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
        pageNumber,
        pageSize,
    });

    let bookSortOptions = [{
        label: t('book.title.label'),
        value: 'title',
        icon: <IconTitle />
    }, {
        label: t('book.dateCreated'),
        value: 'dateCreated',
        icon: <IconDateCreated />
    }];
    if (series) {
        bookSortOptions.push({
            label: t('book.seriesIndex.label'),
            value: 'seriesIndex',
            icon: <IconSeriesIndex />
        })
    }

    return <DataView
        title={showTitle ? t('header.books') : null}
        emptyText={t('books.empty')}
        dataSource={books}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('books.error.loading.title')}
        errorDetail={t('books.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='books-list-view'
        cardRender={book => (<BookCard libraryId={libraryId} key={book.id} book={book} />)}
        listItemRender={book => (<BookListItem libraryId={libraryId} key={book.id} book={book} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToBooksPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToBooksPage(location, {
            pageNumber: 1,
            query: search,
        }))}
        extraFilters={
            <>
                <Button variant='default' leftSection={<IconAdd />} component={Link} to={`/libraries/${libraryId}/books/add`}>{t('book.actions.add.label')}</Button>
                <BookFilterMenu value={status} onChange={value => navigate(updateLinkToBooksPage(location, {
                    status: value
                }))} />
                <SortMenu options={bookSortOptions} value={sortBy} onChange={value => navigate(updateLinkToBooksPage(location, {
                    pageNumber: 1,
                    sortBy: value,
                }))} />
                <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToBooksPage(location, {
                    pageNumber: 1,
                    sortDirection: dir,
                }))} />
            </>
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}

    />;
}

BooksList.propTypes = {
    libraryId: PropTypes.string,
    query: PropTypes.string,
    author: PropTypes.number,
    category: PropTypes.string,
    series: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    favorite: PropTypes.string,
    read: PropTypes.string,
    status: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
    showTitle: PropTypes.bool,
}

export default BooksList;