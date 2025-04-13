
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Ui Library imports
import { Anchor, Button, Card, Center, Divider, Group, Loader, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { Carousel } from '@mantine/carousel';

// Local imports
import { useGetBooksQuery } from '@/store/slices/books.api';
import { SortDirection } from "@/models";
import { IconRefreshAlert } from '@/components/icons';
import BookCard from './bookCard';
//------------------------------
const BooksCarousel = ({ libraryId, status }) => {
    const { t } = useTranslation();
    const {
        refetch,
        data: books,
        error,
        isFetching,
    } = useGetBooksQuery({
        libraryId,
        sortBy: "DateCreated",
        sortDirection: SortDirection.Descending,
        status: status,
    });

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
    return (<Card>
        <Stack>
            <Group justify="space-between">
                <Title order={3}>{t(`books.withStatus.${status}`)}</Title>
                <Anchor component={Link} underline="hover" to={`/libraries/${libraryId}/books?read=true`}>{t('actions.viewAll')}</Anchor>
            </Group>
            {content}
            <Divider my="md" />
        </Stack>
    </Card>)
}

BooksCarousel.propTypes = {
    libraryId: PropTypes.string,
    status: PropTypes.string
};

export default BooksCarousel;