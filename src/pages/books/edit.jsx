import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Card, Center, Container, Grid, LoadingOverlay, rem, Skeleton, useMantineTheme } from "@mantine/core";

// Local imports
import { useGetBookQuery, useAddBookMutation, useUpdateBookMutation, useUpdateBookImageMutation } from '@/store/slices/books.api';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconBook } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import BookForm from '@/components/books/bookForm';
import { error, success } from '@/utils/notifications';
//---------------------------------
const PageLoading = () => {
    const PRIMARY_COL_HEIGHT = rem(300);
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
    return (<Container fluid mt="sm">
        <Grid mih={50}>
            <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
            </Grid.Col>
        </Grid>
    </Container>);
}

const EditBookPage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, bookId } = useParams();
    const isEditing = useMemo(() => bookId != null, [bookId]);
    const [image, setImage] = useState(null);
    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const [updateBookImage, { isLoading: isUpdatingImage }] = useUpdateBookImageMutation();

    const { data: book, refetch, error: errorLoading, isFetching } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

    useEffect(() => {
        if (book && !book?.links?.update) {
            navigate('/403')
        }
    }, [book, navigate]);

    const onSubmit = async (book) => {
        if (isEditing) {
            updateBook({ libraryId, bookId, payload: book })
                .unwrap()
                .then(() => uploadImage(bookId))
                .then(() => success({ message: t("book.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/books/${bookId}`))
                .catch(() => error({ message: t("book.actions.edit.error") }));
        } else {
            let response = null;
            addBook({ libraryId, payload: book })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => success({ message: t("book.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/books/${response.id}`))
                .catch(() => error({ message: t("book.actions.add.error") }));
        }
    };

    const uploadImage = async (newBookId) => {
        if (image) {
            await updateBookImage({ libraryId, bookId: newBookId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconBook width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = book ? book.title : t("book.actions.add.title");
    if (isFetching) return <PageLoading />;
    if (errorLoading) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    };

    return (<Container fluid mt="sm">
        <PageHeader title={title}>
        </PageHeader>
        <Container size="responsive">
            <Box pos="relative">
                <LoadingOverlay visible={isFetching || isAdding || isUpdating || isUpdatingImage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Grid
                    mih={50}
                >
                    <Grid.Col span="content">
                        <ImageUpload
                            t={t}
                            src={book?.links?.image}
                            alt={book?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <BookForm libraryId={libraryId} book={book} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditBookPage;