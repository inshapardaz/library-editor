import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import moment from "moment";

// UI Library Import
import { Card, Center, Container, Grid, rem, Skeleton, Space, Stack, Tabs, Text, useMantineTheme } from "@mantine/core";

// Local Import
import { useGetPeriodicalByIdQuery } from '@/store/slices/periodicals.api';
import { useGetIssueQuery } from "@/store/slices/issues.api";
import { IconIssue, IconPages, IconIssueArticle, IconFiles } from '@/components/icons';
import IconNames from '@/components/iconNames';
import { getDateFormatFromFrequency } from '@/utils';
import IssueArticlesList from "@/components/periodicals//issues/articles/issueArticlesList";
import PageHeader from "@/components/pageHeader";
import Error from '@/components/error';
import Img from '@/components/img';
import IssueInfo from "../../../components/periodicals/issues/issueInfo";

// -----------------------------------------
const PRIMARY_COL_HEIGHT = rem(300);
// -----------------------------------------
const IssuePage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section") ?? "articles";
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

    const onChange = (key) => {
        navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/?section=${key}`);
    };

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
    const icon = <Center h={450}><IconIssue width={250} style={{ color: theme.colors.dark[1] }} /></Center>;


    return (<>
        <PageHeader title={`${periodical?.title} - ${title}`}
            details={periodical.description}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.periodicals'), href: `/libraries/${libraryId}/periodicals`, icon: IconNames.Periodical },
                { title: periodical?.title, href: `/libraries/${libraryId}/periodicals/${periodicalId}`, icon: IconNames.Periodical },
            ]} />
        <Container size="responsive">
            <Grid mih={50}>
                <Grid.Col span="content">
                    <Img
                        src={issue?.links?.image}
                        h={rem(400)}
                        w="auto"
                        radius="md"
                        alt={title}
                        fit='contain'
                        fallback={icon}
                    />
                    <Stack hiddenFrom='md'>
                        <Space h="md" />
                    </Stack>
                    <Space h="md" />
                    <IssueInfo libraryId={libraryId} periodical={periodical} issue={issue} isLoading={isFetchingPeriodical || isFetchingIssue} />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Card withBorder>
                        <Tabs value={section} onChange={onChange}>
                            <Tabs.List>
                                <Tabs.Tab value="articles" leftSection={<IconIssueArticle style={{ color: theme.colors.dark[3] }} />}>
                                    {t('issue.articles.title')}
                                </Tabs.Tab>
                                <Tabs.Tab value="pages" leftSection={<IconPages style={{ color: theme.colors.dark[3] }} />}>
                                    {t('issue.pages.title')}
                                </Tabs.Tab>
                                <Tabs.Tab value="files" leftSection={<IconFiles style={{ color: theme.colors.dark[3] }} />}>
                                    {t('issue.files.title')}
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="articles">
                                <IssueArticlesList
                                    libraryId={libraryId}
                                    periodicalId={periodicalId}
                                    volumeNumber={volumeNumber}
                                    issueNumber={issueNumber}
                                    issue={issue}
                                    showSearch
                                    showTitle={false} />
                            </Tabs.Panel>

                            <Tabs.Panel value="pages">
                                {/* <BookPagesList libraryId={libraryId} book={book} isLoading={loadingBook}
                            writerAssignmentFilter={writerAssignmentFilter}
                            reviewerAssignmentFilter={reviewerAssignmentFilter}
                            sortDirection={sortDirection}
                            status={status}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                        /> */}
                            </Tabs.Panel>

                            <Tabs.Panel value="files">
                                {/* <BookFilesList libraryId={libraryId} book={book} isLoading={loadingBook} /> */}
                            </Tabs.Panel>
                        </Tabs>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    </>)
}

export default IssuePage;