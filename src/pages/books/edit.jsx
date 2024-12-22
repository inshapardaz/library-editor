import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Button, Card, Center, Container, Flex, Grid, Group, LoadingOverlay, NumberInput, rem, Skeleton, Switch, Textarea, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { notifications } from '@mantine/notifications';

// Local imports
import { useGetBookQuery, useAddBookMutation, useUpdateBookMutation, useUpdateBookImageMutation } from '@/store/slices/books.api';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { BookStatus, Copyrights } from '@/models';
import { IconBook } from '@/components/icon';
import PublishStatusSelect from '@/components/publishStatusSelect';
import LanguageSelect from '@/components/languageSelect';
import AuthorsSelect from '@/components/authors/authorsSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';
import SeriesSelect from '@/components/series/seriesSelect';
import ImageUpload from '@/components/imageUpload';
import CopyrightSelect from '@/components/copyrightSelect';
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

const BookForm = ({ libraryId, book = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            description: '',
            isPublic: true,
            authors: [],
            categories: [],
            language: '',
            yearPublished: new Date().getFullYear(),
            publisher: null,
            copyrights: Copyrights.Unknown,
            seriesId: null,
            seriesIndex: null,
            source: null,
            status: BookStatus.AvailableForTyping
        },

        validate: {
            title: isNotEmpty(t("book.title.required")),
            authors: value => value.length < 1 ? (t("book.authors.required")) : null,
            language: isNotEmpty(t("book.language.required")),
            yearPublished: isInRange({ min: 1000, max: new Date().getFullYear() }, t("book.language.required")),
        },
    });

    useEffect(() => {
        if (!loaded && book != null) {
            form.initialize(book);
            setLoaded(true);
        }
    }, [book, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('title')}
                label={t("book.title.label")}
                placeholder={t("book.title.placeholder")}
                {...form.getInputProps('title')}
            />

            <Textarea key={form.key('description')}
                label={t("book.description.label")}
                placeholder={t("book.description.placeholder")}
                {...form.getInputProps('description')} />

            <Switch
                label={t("book.public.label")}
                key={form.key('isPublic')}
                {...form.getInputProps('isPublic', { type: 'checkbox' })}
            />

            <AuthorsSelect t={t} libraryId={libraryId}
                label={t("book.authors.label")}
                placeholder={t("book.authors.placeholder")}
                {...form.getInputProps('authors')} />

            <CategoriesSelect t={t}
                libraryId={libraryId}
                label={t("book.categories.label")}
                placeholder={t("book.categories.placeholder")}
                {...form.getInputProps('categories')} />
            <LanguageSelect
                label={t("book.language.label")}
                {...form.getInputProps('language')}
            />
            <CopyrightSelect t={t}
                label={t("book.copyrights.label")}
                {...form.getInputProps('copyrights')}
            />
            <NumberInput key={form.key('yearPublished')}
                label={t("book.yearPublished.label")}
                placeholder={t("book.yearPublished.placeholder")}
                {...form.getInputProps('yearPublished')}
            />
            <TextInput key={form.key('publisher')}
                label={t("book.publisher.label")}
                placeholder={t("book.publisher.placeholder")}
                {...form.getInputProps('publisher')}
            />
            <Flex gap="md">
                <SeriesSelect t={t} libraryId={libraryId}
                    label={t("book.series.label")}
                    placeholder={t("book.series.placeholder")}
                    {...form.getInputProps('seriesId')}
                    style={{ flex: 1 }}
                />

                <NumberInput key={form.key('seriesIndex')}
                    label={t("book.seriesIndex.label")}
                    {...form.getInputProps('seriesIndex')}
                    min={1}
                    max={1000}
                />
            </Flex>

            <TextInput key={form.key('source')}
                label={t("book.source.label")}
                placeholder={t("book.source.placeholder")}
                {...form.getInputProps('source')}
            />
            <PublishStatusSelect t={t}
                label={t("book.status.label")}
                {...form.getInputProps('status')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

BookForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    libraryId: PropTypes.any,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

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

    const { data: book, refetch, error, isFetching } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

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
                .then(() => notifications.show({
                    color: 'green',
                    title: t("book.actions.edit.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/books/${bookId}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("book.actions.edit.error")
                }));
        } else {
            let response = null;
            addBook({ libraryId, payload: book })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("book.actions.add.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/books/${response.id}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("book.actions.add.error")
                }));
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
    if (error) {
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