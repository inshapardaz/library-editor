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
    useGetSeriesByIdQuery,
    useAddSeriesMutation,
    useUpdateSeriesMutation,
    useUpdateSeriesImageMutation
}
    from '@/store/slices/series.api';

import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconSeries } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
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


const SeriesForm = ({ series = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: ''
        },

        validate: {
            name: isNotEmpty(t("series.name.required")),
        },
    });

    useEffect(() => {
        if (!loaded && series != null) {
            form.initialize(series);
            setLoaded(true);
        }
    }, [series, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('name')}
                label={t("series.name.label")}
                placeholder={t("series.name.placeholder")}
                {...form.getInputProps('name')}
            />

            <Textarea key={form.key('description')}
                label={t("series.description.label")}
                {...form.getInputProps('description')} />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

SeriesForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    series: PropTypes.shape({
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

const EditSeriesPage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, seriesId } = useParams();
    const isEditing = useMemo(() => seriesId != null, [seriesId]);
    const [image, setImage] = useState(null);
    const [addSeries, { isLoading: isAdding }] = useAddSeriesMutation();
    const [updateSeries, { isLoading: isUpdating }] = useUpdateSeriesMutation();
    const [updateSeriesImage, { isLoading: isUpdatingImage }] = useUpdateSeriesImageMutation();

    const { data: series, refetch, error, isFetching } = useGetSeriesByIdQuery({ libraryId, seriesId }, { skip: !libraryId || !seriesId });

    useEffect(() => {
        if (series && !series?.links?.update) {
            navigate('/403')
        }
    }, [series, navigate]);

    const onSubmit = async (series) => {
        if (isEditing) {
            updateSeries({ libraryId, seriesId, payload: series })
                .unwrap()
                .then(() => uploadImage(seriesId))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("series.actions.edit.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/series/${seriesId}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("series.actions.edit.error")
                }));
        } else {
            let response = null;
            addSeries({ libraryId, payload: series })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => notifications.show({
                    color: 'green',
                    title: t("series.actions.add.success")
                }))
                .then(() => navigate(`/libraries/${libraryId}/series/${response.id}`))
                .catch(() => notifications.show({
                    color: 'red',
                    title: t("series.actions.add.error")
                }));
        }
    };

    const uploadImage = async (newSeriesId) => {
        if (image) {
            await updateSeriesImage({ libraryId, seriesId: newSeriesId, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconSeries width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = series ? series.name : t("series.actions.add.title");
    if (isFetching) return <PageLoading />;
    if (error) {
        return (<Container fluid mt="sm">
            <Error title={t('series.error.loading.title')}
                detail={t('series.error.loading.detail')}
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
                            src={series?.links?.image}
                            alt={series?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <SeriesForm libraryId={libraryId} series={series} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditSeriesPage;