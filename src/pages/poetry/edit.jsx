import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Button, Card, Center, Container, Grid, Group, LoadingOverlay, Stack, Switch, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, isNotEmpty } from '@mantine/form';

// Local imports
import {
    useGetArticleQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useUpdateArticleImageMutation
}
    from '@/store/slices/articles.api';
import { EditingStatus } from '@/models';

import AuthorsSelect from '@/components/authors/authorsSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import EditingStatusSelect from '@/components/editingStatusSelect';
import { IconPoetry } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import { error, success } from '@/utils/notifications';
import IconNames from '@/components/iconNames';
//---------------------------------

const PoetryForm = ({ libraryId, article = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            type: 'Poetry',
            isPublic: false,
            authors: [],
            categories: [],
            status: EditingStatus.Available
        },

        validate: {
            title: isNotEmpty(t("poetry.title.required")),
            authors: value => value.length < 1 ? (t("poetry.authors.required")) : null,
        },
    });

    useEffect(() => {
        if (!loaded && article != null) {
            form.initialize(article);
            setLoaded(true);
        }
    }, [article, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Stack gap="md">
                <TextInput key={form.key('title')}
                    label={t("poetry.title.label")}
                    placeholder={t("poetry.title.placeholder")}
                    {...form.getInputProps('title')}
                />

                <AuthorsSelect t={t} libraryId={libraryId}
                    label={t("poetry.authors.label")}
                    placeholder={t("poetry.authors.placeholder")}
                    {...form.getInputProps('authors')} />
                <CategoriesSelect t={t}
                    libraryId={libraryId}
                    label={t("poetry.categories.label")}
                    placeholder={t("poetry.categories.placeholder")}
                    {...form.getInputProps('categories')} />

                <Switch
                    label={t("poetry.public.label")}
                    key={form.key('isPublic')}
                    {...form.getInputProps('isPublic', { type: 'checkbox' })}
                />

                <EditingStatusSelect t={t}
                    label={t("poetry.status.label")}
                    {...form.getInputProps('status')} />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">{t('actions.save')}</Button>
                    <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
                </Group>
            </Stack>
        </form>
    );
}

PoetryForm.propTypes = {
    libraryId: PropTypes.any,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    article: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

//---------------------------------

const PoetryEditPage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, articleId } = useParams();
    const isEditing = useMemo(() => articleId != null, [articleId]);
    const [image, setImage] = useState(null);
    const [add, { isLoading: isAdding }] = useAddArticleMutation();
    const [update, { isLoading: isUpdating }] = useUpdateArticleMutation();
    const [updateImage, { isLoading: isUpdatingImage }] = useUpdateArticleImageMutation();

    const { data: article, refetch, error: errorLoading, isFetching } = useGetArticleQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });

    useEffect(() => {
        if (article && !article?.links?.update) {
            navigate('/403')
        }
    }, [article, navigate]);

    const onSubmit = async (_article) => {
        if (isEditing) {
            update({ libraryId, articleId, payload: _article })
                .unwrap()
                .then(() => uploadImage(articleId))
                .then(() => success({ message: t("poetry.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/poetry/${articleId}`))
                .catch(() => error({ message: t("poetry.actions.edit.error") }));
        } else {
            let response = null;
            add({ libraryId, payload: _article })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => success({ message: t("poetry.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/poetry/${response.id}`))
                .catch(() => error({ message: t("poetry.actions.add.error") }));
        }
    };

    const uploadImage = async (newArticleId) => {
        if (image) {
            await updateImage({ libraryId, articleId: newArticleId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconPoetry width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = article ? article.title : t("poetry.actions.add.title");

    if (errorLoading) {
        return (<Container fluid mt="sm">
            <Error title={t('poetry.error.loading.title')}
                detail={t('poetry.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    };

    let breadcrumbs = [
        { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
        { title: t('header.poetry'), href: `/libraries/${libraryId}/poetry`, icon: IconNames.Poetry }
    ];

    if (isEditing) {
        breadcrumbs.push({ title: title, href: `/libraries/${libraryId}/poetry/${articleId}`, icon: IconNames.Poetry });
        breadcrumbs.push({ title: t('actions.edit'), icon: IconNames.Edit });
    } else {
        breadcrumbs.push({ title: title, icon: IconNames.Add });
    }

    return (<Container fluid mt="sm">
        <PageHeader title={title} breadcrumbs={breadcrumbs} />
        <Container size="responsive">
            <Box pos="relative">
                <LoadingOverlay visible={isFetching || isAdding || isUpdating || isUpdatingImage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Grid
                    mih={50}
                >
                    <Grid.Col span="content">
                        <ImageUpload
                            t={t}
                            src={article?.links?.image}
                            alt={article?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <PoetryForm libraryId={libraryId} article={article} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default PoetryEditPage;