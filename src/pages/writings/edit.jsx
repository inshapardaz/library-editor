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
import { IconWriting } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import { error, success } from '@/utils/notifications';
import IconNames from '@/components/iconNames';
//---------------------------------

const WritingForm = ({ libraryId, article = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            type: 'Writing',
            isPublic: false,
            authors: [],
            categories: [],
            status: EditingStatus.Available
        },

        validate: {
            title: isNotEmpty(t("writing.title.required")),
            authors: value => value.length < 1 ? (t("writing.authors.required")) : null,
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
                    label={t("writing.title.label")}
                    placeholder={t("writing.title.placeholder")}
                    {...form.getInputProps('title')}
                />

                <AuthorsSelect t={t} libraryId={libraryId}
                    label={t("writing.authors.label")}
                    placeholder={t("writing.authors.placeholder")}
                    {...form.getInputProps('authors')} />
                <CategoriesSelect t={t}
                    libraryId={libraryId}
                    label={t("writing.categories.label")}
                    placeholder={t("writing.categories.placeholder")}
                    {...form.getInputProps('categories')} />

                <Switch
                    label={t("writing.public.label")}
                    key={form.key('isPublic')}
                    {...form.getInputProps('isPublic', { type: 'checkbox' })}
                />

                <EditingStatusSelect t={t}
                    label={t("writing.status.label")}
                    {...form.getInputProps('status')} />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">{t('actions.save')}</Button>
                    <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
                </Group>
            </Stack>
        </form>
    );
}

WritingForm.propTypes = {
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

const WritingEditPage = () => {
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
                .then(() => success({ message: t("writing.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/writings/${articleId}`))
                .catch(() => error({ message: t("writing.actions.edit.error") }));
        } else {
            let response = null;
            add({ libraryId, payload: _article })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => success({ message: t("writing.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/writings/${response.id}`))
                .catch(() => error({ message: t("writing.actions.add.error") }));
        }
    };

    const uploadImage = async (newArticleId) => {
        if (image) {
            await updateImage({ libraryId, articleId: newArticleId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconWriting width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = article ? article.title : t("writing.actions.add.title");

    if (errorLoading) {
        return (<Container fluid mt="sm">
            <Error title={t('writing.error.loading.title')}
                detail={t('writing.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    };

    let breadcrumbs = [
        { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
        { title: t('header.writings'), href: `/libraries/${libraryId}/writings`, icon: IconNames.Writings }
    ];

    if (isEditing) {
        breadcrumbs.push({ title: title, href: `/libraries/${libraryId}/writings/${articleId}`, icon: IconNames.Writing });
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
                            <WritingForm libraryId={libraryId} article={article} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default WritingEditPage;