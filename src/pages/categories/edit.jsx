import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Button, Card, Container, Grid, Group, LoadingOverlay, rem, Skeleton, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from '@mantine/form';

// Local imports
import {
    useGetCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation
}
    from '@/store/slices/categories.api';

import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
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
//---------------------------------


const CategoryForm = ({ category = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
        },

        validate: {
            name: isNotEmpty(t("category.name.required")),
        },
    });

    useEffect(() => {
        if (!loaded && category != null) {
            form.initialize(category);
            setLoaded(true);
        }
    }, [category, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('name')}
                label={t("category.name.label")}
                placeholder={t("category.name.placeholder")}
                {...form.getInputProps('name')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

CategoryForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    })
};

//---------------------------------

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, categoryId } = useParams();
    const isEditing = useMemo(() => categoryId != null, [categoryId]);
    const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const { data: category, refetch, error: errorLoading, isFetching } = useGetCategoryQuery({ libraryId, categoryId }, { skip: !libraryId || !categoryId });

    useEffect(() => {
        if (category && !category?.links?.update) {
            navigate('/403')
        }
    }, [category, navigate]);

    const onSubmit = async (cat) => {
        if (isEditing) {
            updateCategory({ libraryId, categoryId, payload: cat })
                .unwrap()
                .then(() => success({ message: t("category.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/books?category=${categoryId}`))
                .catch((e) => {
                    console.error(e);
                    error({ message: t("category.actions.edit.error") });
                });
        } else {
            let response = null;
            addCategory({ libraryId, payload: cat })
                .unwrap()
                .then(r => { response = r })
                .then(() => success({ message: t("category.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/books?category=${response.id}`))
                .catch((e) => {
                    console.error(e);
                    error({ message: t("category.actions.add.error") });
                });
        }
    };


    const title = category ? category.name : t("category.actions.add.title");
    if (isFetching) return <PageLoading />;
    if (errorLoading) {
        return (<Container fluid mt="sm">
            <Error title={t('category.error.loading.title')}
                detail={t('category.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    };

    return (<Container fluid mt="sm">
        <PageHeader title={title}>
        </PageHeader>
        <Container size="responsive">
            <Box pos="relative">
                <LoadingOverlay visible={isFetching || isAdding || isUpdating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Card withBorder maw={600}>
                    <CategoryForm libraryId={libraryId} category={category} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                </Card>
            </Box>
        </Container>
    </Container >);
}

export default EditCategoryPage;
