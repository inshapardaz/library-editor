import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Button, Card, Center, Container, Grid, Group, LoadingOverlay, rem, Skeleton, Textarea, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, isNotEmpty } from '@mantine/form';
import { notifications } from '@mantine/notifications';

// Local imports
import {
    useGetAuthorQuery,
    useAddAuthorMutation,
    useUpdateAuthorMutation,
    useUpdateAuthorImageMutation
}
    from '@/store/slices/authors.api';

import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconAuthor } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import AuthorTypeSelect from '@/components/authors/authorTypeSelect';
import { AuthorTypes } from '@/models';
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
//---------------------------------


const AuthorForm = ({ author = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: '',
            type: AuthorTypes.Writer
        },

        validate: {
            name: isNotEmpty(t("author.name.required")),
            type: isNotEmpty(t("author.type.required")),
        },
    });

    useEffect(() => {
        if (!loaded && author != null) {
            form.initialize(author);
            setLoaded(true);
        }
    }, [author, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('name')}
                label={t("author.name.label")}
                placeholder={t("author.name.placeholder")}
                {...form.getInputProps('name')}
            />

            <Textarea key={form.key('description')}
                label={t("author.description.label")}
                {...form.getInputProps('description')} />

            <AuthorTypeSelect t={t}
                label={t("author.type.label")}
                {...form.getInputProps('type')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

AuthorForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

//---------------------------------

const EditAuthorPage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, authorId } = useParams();
    const isEditing = useMemo(() => authorId != null, [authorId]);
    const [image, setImage] = useState(null);
    const [addAuthor, { isLoading: isAdding }] = useAddAuthorMutation();
    const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();
    const [updateAuthorImage, { isLoading: isUpdatingImage }] = useUpdateAuthorImageMutation();

    const { data: author, refetch, error, isFetching } = useGetAuthorQuery({ libraryId, authorId }, { skip: !libraryId || !authorId });

    useEffect(() => {
        if (author && !author?.links?.update) {
            navigate('/403')
        }
    }, [author, navigate]);

    const onSubmit = async (author) => {
        if (isEditing) {
            updateAuthor({ libraryId, authorId, payload: author })
                .unwrap()
                .then(() => uploadImage(authorId))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("author.actions.edit.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/authors/${authorId}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("author.actions.edit.error")
                }));
        } else {
            let response = null;
            addAuthor({ libraryId, payload: author })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("author.actions.add.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/authors/${response.id}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("author.actions.add.error")
                }));
        }
    };

    const uploadImage = async (newAuthorId) => {
        if (image) {
            await updateAuthorImage({ libraryId, authorId: newAuthorId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconAuthor width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = author ? author.name : t("author.actions.add.title");
    if (isFetching) return <PageLoading />;
    if (error) {
        return (<Container fluid mt="sm">
            <Error title={t('author.error.loading.title')}
                detail={t('author.error.loading.detail')}
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
                            src={author?.links?.image}
                            alt={author?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <AuthorForm libraryId={libraryId} author={author} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditAuthorPage;