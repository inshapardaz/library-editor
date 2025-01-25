import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// UI Library Imports
import { Box, Button, Card, Center, Container, Grid, Group, LoadingOverlay, rem, Skeleton, TextInput, useMantineTheme } from "@mantine/core";
import { useForm, isNotEmpty } from '@mantine/form';

// Local imports
import {
    useGetArticleQuery,
}
    from '@/store/slices/issues.api';
import { useAddIssueArticleMutation, useUpdateIssueArticleMutation }
    from '@/store/slices/issueArticles.api';
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import { IconPeriodical } from '@/components/icons';
import PublishStatusSelect from '@/components/publishStatusSelect';
import AuthorsSelect from '@/components/authors/authorsSelect';
import { BookStatus } from '@/models';
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


const IssueArticleForm = ({ libraryId, article = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            authors: [],
            status: BookStatus.AvailableForTyping
        },

        validate: {
            title: isNotEmpty(t("issueArticle.title.required")),
            authors: value => value.length < 1 ? (t("issueArticle.authors.required")) : null
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
            <TextInput key={form.key('title')}
                label={t("issueArticle.title.label")}
                placeholder={t("issueArticle.title.placeholder")}
                {...form.getInputProps('title')}
            />

            <AuthorsSelect t={t} libraryId={libraryId}
                label={t("issueArticle.authors.label")}
                placeholder={t("issueArticle.authors.placeholder")}
                {...form.getInputProps('authors')} />

            <PublishStatusSelect t={t}
                label={t("issueArticle.status.label")}
                {...form.getInputProps('status')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

IssueArticleForm.propTypes = {
    libraryId: PropTypes.any,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    article: PropTypes.shape({
        title: PropTypes.string,
        authors: PropTypes.array,
        status: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            edit: PropTypes.string
        })
    })
};

//---------------------------------

const EditIssueArticlePage = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber } = useParams();
    const isEditing = useMemo(() => articleNumber != null, [articleNumber]);
    const { data: article, refetch: refetchArticle, error: errorArticle, isFetching: isFetchingArticle } =
        useGetArticleQuery({ libraryId, periodicalId, volumeNumber, issueNumber, articleNumber },
            { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber || !articleNumber });
    const [addIssueArticle, { isLoading: isAddingIssueArticle }] = useAddIssueArticleMutation();
    const [updateIssueArticle, { isLoading: isUpdatingIssueArticle }] = useUpdateIssueArticleMutation();

    useEffect(() => {
        if (article && !article?.links?.update) {
            navigate('/403')
        }
    }, [article, navigate]);

    const onSubmit = async (values) => {
        if (isEditing) {
            updateIssueArticle({ url: values.links.update, payload: values })
                .unwrap()
                .then(() => success({ message: t("issueArticle.actions.edit.success") }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`))
                .catch(() => error({ message: t("issueArticle.actions.edit.error") }));
        } else {
            addIssueArticle({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload: values
            })
                .unwrap()
                .then(() => success({ message: t("issueArticle.actions.add.success") }))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`))
                .catch(() => error({ message: t("issueArticle.actions.add.error") }));
        }
    };

    const icon = <Center h={450}><IconPeriodical width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const title = article ? article.title : t("issueArticle.actions.add.label");

    if (isFetchingArticle) return <PageLoading />;
    if (errorArticle) {
        return (<Container fluid mt="sm">
            <Error title={t('issueArticle.error.loading.title')} //Add these translations
                detail={t('issueArticle.error.loading.detail')}
                onRetry={refetchArticle} />
        </Container>)
    };

    return (<Container fluid mt="sm">
        <PageHeader title={title}>
        </PageHeader>
        <Container size="responsive">
            <Box pos="relative">
                <LoadingOverlay visible={isAddingIssueArticle || isUpdatingIssueArticle} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Grid
                    mih={50}
                >
                    <Grid.Col span="content">
                        {icon}
                    </Grid.Col>
                    <Grid.Col span="auto" >
                        <Card withBorder maw={600}>
                            <IssueArticleForm article={article} libraryId={libraryId} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    </Container >);
}

export default EditIssueArticlePage;