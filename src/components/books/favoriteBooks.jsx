import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

// UI Library imports
import { Box, Button, Center, Divider, Loader, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { Carousel } from '@mantine/carousel';

// Local Imports
import { isLoggedIn } from "@/store/slices/authSlice";
import { useGetBooksQuery } from '@/store/slices/books.api';
import BookCard from './bookCard';
import { IconRefreshAlert } from '@/components/icon';
//------------------------------

const FavioriteBooks = ({ libraryId }) => {
    const isUserLoggedIn = useSelector(isLoggedIn);
    const { t } = useTranslation();
    const {
        refetch,
        data: books,
        error,
        isFetching,
    } = useGetBooksQuery({
        libraryId,
        favorite: true,
        sortDirection: "ascending",
    });

    if (!isUserLoggedIn) return null;

    let content = null;
    if (isFetching) {
        content = (
            <Center h={100}>
                <LoadingOverlay visible={true} loaderProps={{ children: <Loader size={30} /> }} />
            </Center>)
    } else if (error) {
        content = (
            <Center h={100}>
                <Button rightSection={<IconRefreshAlert />} onClick={refetch}>{t('actions.retry')}</Button>
            </Center>)
    } else if (books?.data && books.data.length > 0) {
        content = (<Carousel
            slideSize={{
                base: '100%',
                sm: '50%',
                md: '33.333333%',
                lg: '20%',

            }}
            slideGap="md"
            loop
            align="start"
        >
            {books.data.map((book) => (
                <Carousel.Slide key={book.id}><BookCard libraryId={libraryId} book={book} /></Carousel.Slide>
            ))}
        </Carousel>);
    } else {
        content = (<Center h={100}><Text>{t('books.empty')}</Text></Center>)
    }
    return (<Box>
        <Stack>
            <Title order={3}>{t('book.favorites')}</Title>
            {content}
            <Divider my="md" />
        </Stack>
    </Box>)
}

FavioriteBooks.propTypes = {
    libraryId: PropTypes.string
};

export default FavioriteBooks;