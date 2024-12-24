import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// UI Library Import
import { Button, Card, Center, Divider, Group, rem, Skeleton, Text, useMantineTheme } from "@mantine/core";
import moment from "moment";

// Local Import
import { useGetPeriodicalByIdQuery } from '@/store/slices/periodicals.api';
import { useGetIssueQuery } from "@/store/slices/issues.api";
import { IconVolumeNumber, IconIssueNumber, IconPages, IconIssueArticle, IconAdd } from '@/components/icon';
import IconNames from '@/components/iconNames';
import { getDateFormatFromFrequency } from '@/utils';
import IssueArticlesList from "@/components/periodicals//issues/articles/issueArticlesList";
import PageHeader from "@/components/pageHeader";
import IconText from '@/components/iconText';
import Error from '@/components/error';

// -----------------------------------------
const PRIMARY_COL_HEIGHT = rem(300);
// -----------------------------------------
const IssuePage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const { libraryId, periodicalId, volumeNumber, issueNumber } = useParams();

    const {
        data: periodical,
        isError: errorPeriodical,
        isFetching: isFetchingPeriodical,
    } = useGetPeriodicalByIdQuery({
        libraryId,
        periodicalId
    });

    const {
        refetch,
        data: issue,
        isError: errorIssue,
        isFetching: isFetchingIssue,
    } = useGetIssueQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
    });

    if (isFetchingPeriodical || isFetchingIssue) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (errorPeriodical || errorIssue) {
        return (<Error title={t('issue.error.loading.title')} //Add these translations
            detail={t('issue.error.loading.detail')}
            onRetry={refetch} />)
    }
    if (!issue) {
        return (<Center h={100}><Text>Not Found</Text></Center>);
    }

    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(periodical?.frequency));


    return (<>
        <PageHeader title={`${periodical?.title} - ${title}`}
            imageLink={issue.links?.image}
            defaultIcon={IconNames.Periodical}
            subTitle={
                <Group>
                    <IconText icon={<IconVolumeNumber style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.volumeNumber.title', { volumeNumber: issue.volumeNumber })}
                        link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}`} />
                    <Divider orientation="vertical" />
                    <IconText icon={<IconIssueNumber style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.issueNumber.title', { issueNumber: issue.issueNumber })} />
                    <Divider orientation="vertical" />
                    <IconText icon={<IconPages style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.pageCount', { count: issue.pageCount })} />
                    <Divider orientation="vertical" />
                    <IconText icon={<IconIssueArticle style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.articleCount', { count: issue.articleCount })} />
                </Group>
            }
            details={periodical.description}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.periodicals'), href: `/libraries/${libraryId}/periodicals`, icon: IconNames.Periodical },
                { title: periodical?.title, href: `/libraries/${libraryId}/periodicals/${periodicalId}`, icon: IconNames.Periodical },
            ]} actions={[
                (<Button key="issue-edit" component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`} variant='default' leftSection={<IconAdd />} >{t('actions.edit')}</Button>),
                (<Button key="issue-add-article" component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/add`} variant='default' leftSection={<IconAdd />} >{t('issueArticle.actions.add.label')}</Button>)
            ]} />
        <Card withBorder m="sm">
            <IssueArticlesList
                libraryId={libraryId}
                periodicalId={periodicalId}
                volumeNumber={volumeNumber}
                issueNumber={issueNumber}
                showSearch
                showTitle={false} />
        </Card>
    </>)
}

export default IssuePage;