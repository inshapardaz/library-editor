import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// UI Library Imports
import { Button, Card, Container, Divider, Grid, Group, rem, Skeleton, useMantineTheme } from "@mantine/core";

// Local Imports
import { useGetPeriodicalByIdQuery } from '@/store/slices/periodicals.api';
import { IconIssues, IconEdit, IconAdd } from '@/components/icon';
import IconNames from '@/components/iconNames';
import IssuesList from "@/components/periodicals/issues/issuessList";
import FrequencyIcon from "@/components/periodicals/frequencyIcon";
import PeriodicalSideBar from "@/components/periodicals/periodicalSideBar";
import PageHeader from "@/components/pageHeader";
import IconText from "@/components/iconText";
import Error from '@/components/error';
import If from '@/components/if'
//-----------------------------------------
const PRIMARY_COL_HEIGHT = rem(300);
//-----------------------------------------
const PeriodicalPage = () => {
    const { t } = useTranslation();
    const { libraryId, periodicalId, volumeNumber } = useParams();
    const theme = useMantineTheme();
    const {
        data: periodical,
        error: errorLoadingPeriodical,
        isFetching: loadingPeriodical,
        refetch
    } = useGetPeriodicalByIdQuery({
        libraryId,
        periodicalId
    });

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;


    if (loadingPeriodical) {
        return (<Container fluid mt="sm">
            <Grid
                mih={50}
            >
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

    if (errorLoadingPeriodical) {
        return (<Container fluid mt="sm">
            <Error title={t('book.error.loading.title')}
                detail={t('book.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    }

    return (<Container fluid mt="sm">
        <PageHeader title={periodical.title}
            imageLink={periodical.links?.image}
            defaultIcon={IconNames.Periodical}
            subTitle={
                <Group>
                    <FrequencyIcon frequency={periodical.frequency} showLabel c="dimmed" size="sm" height={16} style={{ color: theme.colors.gray[6] }} />
                    <If condition={periodical.issueCount > 0}>
                        <>
                            <Divider orientation="vertical" />
                            <IconText icon={<IconIssues height={16} style={{ color: theme.colors.dark[2] }} />} text={t('periodical.issueCount', { count: periodical.issueCount })} />
                        </>
                    </If>
                </Group>
            }
            details={periodical.description}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.periodicals'), href: `/libraries/${libraryId}/periodicals`, icon: IconNames.Periodicals },
            ]} actions={[
                (<span key="periodical-spacer" style={{ flex: 1 }} />),
                (<Button key="periodical-edit" component={Link} to={`/libraries/${libraryId}/periodicals/${periodical.id}/edit`} variant='default' leftSection={<IconEdit />} >{t('actions.edit')}</Button>),
                (<Button key="periodical-issue-add" component={Link} to={`/libraries/${libraryId}/periodicals/${periodical.id}/issues/add`} variant='default' leftSection={<IconAdd />} >{t('issue.actions.add.label')}</Button>)
            ]} />
        <Grid type="container" breakpoints={{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }}>
            <Grid.Col span={{ md: 12, lg: 3, xl: 2 }} style={{ minWidth: rem(200) }}>
                <PeriodicalSideBar libraryId={libraryId}
                    periodicalId={periodicalId} />
            </Grid.Col>
            <Grid.Col span="auto">
                <Card withBorder>
                    <IssuesList libraryId={libraryId}
                        periodicalId={periodicalId}
                        volumeNumber={volumeNumber}
                        frequency={periodical.frequency}
                        showTitle={true} />
                </Card>
            </Grid.Col>
        </Grid>
    </Container>);
};

export default PeriodicalPage;