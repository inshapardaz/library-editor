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
    useGetPeriodicalByIdQuery,
    useAddPeriodicalMutation,
    useUpdatePeriodicalMutation,
    useUpdatePeriodicalImageMutation
}
    from '@/store/slices/periodicals.api';

import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconPeriodical } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import LanguageSelect from '@/components/languageSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';
import FrequencyTypeSelect from '@/components/periodicals/frequencyTypeSelect';
import { PeriodicalFrequency } from '@/models';
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


const PeriodicalForm = ({ libraryId, periodical = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            description: '',
            frequency: PeriodicalFrequency.Monthly,
            language: '',
            categories: []

        },

        validate: {
            title: isNotEmpty(t("periodical.title.required")),
            frequency: isNotEmpty(t("periodical.frequency.required")),
            language: isNotEmpty(t("periodical.language.required")),
        },
    });

    useEffect(() => {
        if (!loaded && periodical != null) {
            form.initialize(periodical);
            setLoaded(true);
        }
    }, [periodical, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('title')}
                label={t("periodical.title.label")}
                placeholder={t("periodical.title.placeholder")}
                {...form.getInputProps('title')}
            />

            <Textarea key={form.key('description')}
                label={t("periodical.description.label")}
                {...form.getInputProps('description')} />

            <FrequencyTypeSelect t={t}
                label={t("periodical.frequency.label")}
                {...form.getInputProps('frequency')}
            />

            <CategoriesSelect t={t}
                libraryId={libraryId}
                label={t("periodical.categories.label")}
                placeholder={t("periodical.categories.placeholder")}
                {...form.getInputProps('categories')} />
            <LanguageSelect
                label={t("periodical.language.label")}
                {...form.getInputProps('language')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

PeriodicalForm.propTypes = {
    libraryId: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    periodical: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

//---------------------------------

const EditPeriodicalPage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, periodicalId } = useParams();
    const isEditing = useMemo(() => periodicalId != null, [periodicalId]);
    const [image, setImage] = useState(null);
    const [addPeriodical, { isLoading: isAdding }] = useAddPeriodicalMutation();
    const [updatePeriodical, { isLoading: isUpdating }] = useUpdatePeriodicalMutation();
    const [updatePeriodicalImage, { isLoading: isUpdatingImage }] = useUpdatePeriodicalImageMutation();

    const { data: periodical, refetch, error, isFetching } = useGetPeriodicalByIdQuery({ libraryId, periodicalId }, { skip: !libraryId || !periodicalId });

    useEffect(() => {
        if (periodical && !periodical?.links?.update) {
            navigate('/403')
        }
    }, [periodical, navigate]);

    const onSubmit = async (periodical) => {
        if (isEditing) {
            updatePeriodical({ libraryId, periodicalId, payload: periodical })
                .unwrap()
                .then(() => uploadImage(periodicalId))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("periodical.actions.edit.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("periodical.actions.edit.error")
                }));
        } else {
            let response = null;
            addPeriodical({ libraryId, payload: periodical })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("periodical.actions.add.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${response.id}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("periodical.actions.add.error")
                }));
        }
    };

    const uploadImage = async (newPeriodicalId) => {
        if (image) {
            await updatePeriodicalImage({ libraryId, periodicalId: newPeriodicalId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconPeriodical width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = periodical ? periodical.title : t("periodical.actions.add.title");
    if (isFetching) return <PageLoading />;
    if (error) {
        return (<Container fluid mt="sm">
            <Error title={t('periodical.error.loading.title')} //Add these translations
                detail={t('periodical.error.loading.detail')}
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
                            src={periodical?.links?.image}
                            alt={periodical?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <PeriodicalForm libraryId={libraryId} periodical={periodical} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditPeriodicalPage;