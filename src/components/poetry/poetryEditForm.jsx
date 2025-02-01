import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI library import
import { Group, Button, Drawer, Box, Center, useMantineTheme, Stack, TextInput, Switch } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm, isNotEmpty } from "@mantine/form";

// Local Import
import {
    useAddArticleMutation,
    useUpdateArticleMutation,
    useUpdateArticleImageMutation
}
    from '@/store/slices/articles.api';
import { IconImage } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import EditingStatusSelect from '@/components/editingStatusSelect';
import { EditingStatus } from '@/models';
import { error, success } from '@/utils/notifications';
import AuthorsSelect from '@/components/authors/authorsSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';

// --------------------------------------
const PoetryEditForm = ({ libraryId, article = null, children }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [image, setImage] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [loaded, setLoaded] = useState(false);

    const [add, { isLoading: isAdding }] = useAddArticleMutation();
    const [update, { isLoading: isUpdating }] = useUpdateArticleMutation();
    const [updateImage, { isLoading: isUpdatingImage }] = useUpdateArticleImageMutation();

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

    const uploadImage = async (newArticleId) => {
        if (image) {
            await updateImage({ libraryId, articleId: newArticleId, payload: image }).unwrap();
        }
    };

    const onSubmit = async (_article) => {
        if (article) {
            update({ libraryId, articleId: article.id, payload: _article })
                .unwrap()
                .then(() => uploadImage(article.id))
                .then(close)
                .then(() => success({ message: t("poetry.actions.edit.success") }))
                .catch(() => error({ message: t("poetry.actions.edit.error") }));
        } else {
            let response = null;
            add({ libraryId, payload: _article })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(close)
                .then(() => success({ message: t("poetry.actions.add.success") }))
                .catch(() => error({ message: t("poetry.actions.add.error") }));
        }
    };

    const title = article ? t('poetry.actions.edit.title', { sequenceNumber: article.sequenceNumber }) : t('page.actions.add.title')
    const icon = <Center h={450}><IconImage width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (<>
        <Drawer opened={opened} onClose={close} title={title} position='right'>
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

                    <Box mt="md">
                        <ImageUpload
                            t={t}
                            src={article?.links?.image}
                            alt={`${article?.title}` || ''}
                            fallback={icon}
                            onChange={setImage}
                            height="auto"
                            width="100%"
                        />
                    </Box>
                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={isAdding || isUpdating || isUpdatingImage}>{t('actions.save')}</Button>
                        <Button variant='light' onClick={close}>{t('actions.cancel')}</Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
        <Box onClick={open}>
            {children}
        </Box>
    </>
    );
};


PoetryEditForm.propTypes = {
    libraryId: PropTypes.any,
    children: PropTypes.any,
    article: PropTypes.shape({
        id: PropTypes.number,
    })
};

export default PoetryEditForm;