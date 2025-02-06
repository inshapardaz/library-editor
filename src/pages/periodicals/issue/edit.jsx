import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import moment from 'moment/moment';
import { Box, Button, Card, Center, Container, Grid, Group, LoadingOverlay, NumberInput, rem, Skeleton, useMantineTheme } from "@mantine/core";
import { useForm, isInRange } from '@mantine/form';

// Local imports
import {
    useGetIssueQuery,
    useAddIssueMutation,
    useUpdateIssueMutation,
    useUpdateIssueImageMutation
}
    from '@/store/slices/issues.api';
import { useGetPeriodicalByIdQuery }
    from '@/store/slices/periodicals.api';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconPeriodical } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import PublishStatusSelect from '@/components/publishStatusSelect';
import IssueDatePicker from '@/components/periodicals/issues/issueDatePicker';
import { BookStatus, PeriodicalFrequency } from '@/models';
import { getDateFormatFromFrequency } from '@/utils'
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


const IssueForm = ({ frequency = PeriodicalFrequency.Monthly, issue = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            volumeNumber: '',
            issueNumber: '',
            issueDate: new Date(),
            status: BookStatus.AvailableForTyping
        },

        validate: {
            volumeNumber: isInRange({ min: 0, max: 1000 }, t("issue.volumeNumber.required")),
            issueNumber: isInRange({ min: 0, max: 1000 }, t("issue.issueNumber.required")),
            issueDate: (value) => value < new Date('1000-01-01T00:00:00') || value > new Date() ? t("issue.issueDate.required") : null
        },
    });

    useEffect(() => {
        if (!loaded && issue != null) {
            form.initialize(issue);
            setLoaded(true);
        }
    }, [issue, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <NumberInput key={form.key('volumeNumber')}
                label={t("issue.volumeNumber.label")}
                placeholder={t("issue.volumeNumber.placeholder")}
                {...form.getInputProps('volumeNumber')}
            />

            <NumberInput key={form.key('issueNumber')}
                label={t("issue.issueNumber.label")}
                placeholder={t("issue.issueNumber.placeholder")}
                {...form.getInputProps('issueNumber')}
            />

            <IssueDatePicker
                frequency={frequency}
                maxDate={new Date()}
                label={t("issue.issueDate.label")}
                placeholder={t("issue.issueDate.placeholder")}
                {...form.getInputProps('issueDate')}
            />

            <PublishStatusSelect t={t}
                label={t("issue.status.label")}
                {...form.getInputProps('status')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

IssueForm.propTypes = {
    frequency: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    issue: PropTypes.shape({
        volumeNumber: PropTypes.number,
        issueNumber: PropTypes.number,
        issueDate: PropTypes.string,
        status: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            edit: PropTypes.string
        })
    })
};

//---------------------------------

const EditIssuePage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, periodicalId, volumeNumber, issueNumber } = useParams();
    const isEditing = useMemo(() => volumeNumber != null && issueNumber != null, [issueNumber, volumeNumber]);
    const [image, setImage] = useState(null);
    const [addIssue, { isLoading: isAdding }] = useAddIssueMutation();
    const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
    const [updateIssueImage, { isLoading: isUpdatingImage }] = useUpdateIssueImageMutation();

    const { data: issue, refetch, error: issueError, isFetching } = useGetIssueQuery({ libraryId, periodicalId, volumeNumber, issueNumber }, { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber });
    const { data: periodical, refetch: refetchPeriodical, error: periodicalError, isFetching: isFetchingPeriodical } = useGetPeriodicalByIdQuery({ libraryId, periodicalId }, { skip: !libraryId || !periodicalId });

    useEffect(() => {
        if (issue && !issue?.links?.update) {
            navigate('/403')
        }
    }, [issue, navigate]);

    const onSubmit = async (issue) => {
        if (isEditing) {
            updateIssue({ issue, payload: issue })
                .unwrap()
                .then(() => uploadImage(periodicalId, issue.volumeNumber, issue.issueNumber))
                .then(() => success({ message: t("issue.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`))
                .catch(() => error({ message: t("issue.actions.edit.error") }));
        } else {
            let response = null;
            addIssue({ libraryId, periodicalId, volumeNumber: issue.volumeNumber, issueNumber: issue.issueNumber, payload: issue })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.volumeNumber, response.issueNumber))
                .then(() => success({ message: t("issue.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/issues/${response.id}`))
                .catch(() => error({ message: t("issue.actions.add.error") }));
        }
    };

    const uploadImage = async (newVolumeNumber, newIssueNumber) => {
        if (image) {
            await updateIssueImage({ libraryId, periodicalId, volumeNumber: newVolumeNumber, issueNumber: newIssueNumber, payload: image }).unwrap();
        }
    };

    const icon = <Center h={450}><IconPeriodical width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = issue ? moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency)) : t("issue.actions.add.label");

    if (isFetching || isFetchingPeriodical) return <PageLoading />;
    if (issueError || periodicalError) {
        return (<Container fluid mt="sm">
            <Error title={t('issue.error.loading.title')} //Add these translations
                detail={t('issue.error.loading.detail')}
                onRetry={() => {
                    refetch();
                    refetchPeriodical();
                }} />
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
                            src={issue?.links?.image}
                            alt={issue?.title}
                            fallback={icon}
                            onChange={setImage}
                        />
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <IssueForm issue={issue} frequency={periodical.frequency} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditIssuePage;