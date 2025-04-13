import { useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from "moment";

// Ui Library Imports
import { ActionIcon, Breadcrumbs, Button, Center, Container, Drawer, Group, Image, rem, Skeleton, Text, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure, useFullscreen } from '@mantine/hooks';

// Local Import
import { useGetPeriodicalByIdQuery } from '@/store/slices/periodicals.api';
import { useGetIssueQuery } from '@/store/slices/issues.api';
import {
    useGetIssueArticlesQuery,
    useGetIssueArticleQuery,
    useGetIssueArticleContentQuery,
} from "@/store/slices/issueArticles.api";
import { IconFullScreen, IconFullScreenExit, IconSettings, IconPeriodical, IconIssueArticle } from '@/components/icons';
import Error from '@/components/error';
import If from '@/components/if';
import { getDateFormatFromFrequency } from '@/utils';
import ReaderSetting from "@/components/reader/ebook/readerSettings";
import MarkdownReader from "@/components/reader/ebook/markdownReader";
import TableOfContents from "@/components/reader/tableOfContents";
// -----------------------------------------
const PRIMARY_COL_HEIGHT = rem(300);
//------------------------------------------
const getLanguage = (article, language) => {
    if (language) {
        if (article && article.contents) {
            var foundContent = article.contents.find(d => d.language === language);
            if (foundContent?.language) {
                return foundContent?.language;
            }
        }

        return language;
    }

    return 'ur';
}

const IssueArticlePage = () => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber } = useParams();
    const [searchParams] = useSearchParams();
    const langParameter = searchParams.get("language") ?? 'ur';
    const readerTheme = useSelector(state => state.ui.readerTheme);
    const [opened, { open, close }] = useDisclosure(false);
    const { ref, toggle, fullscreen } = useFullscreen();
    const [settingsOpened, { open: openSetings, close: closeSettings }] = useDisclosure(false);

    const {
        refetch: refreshPeriodical,
        data: periodical,
        isError: isErrorLoadingPeriodical,
        isFetching: isLoadingPeriodical,
    } = useGetPeriodicalByIdQuery({
        libraryId, periodicalId
    });

    const {
        refetch: refreshIssue,
        data: issue,
        isError: isErrorLoadingIssue,
        isFetching: isLoadingIssue,
    } = useGetIssueQuery({
        libraryId, periodicalId, volumeNumber, issueNumber
    });

    const {
        refetch: refetchArticles,
        data: articles,
        isError: articlesError,
        isFetching: loadingArticles,
    } = useGetIssueArticlesQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber
    }, { skip: isLoadingIssue });

    const {
        refetch: refetchArticle,
        data: article,
        isError: articleError,
        isFetching: loadingArticle,
    } = useGetIssueArticleQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
        articleNumber
    }, { skip: isLoadingIssue });
    const language = useMemo(() => getLanguage(article, langParameter), [article, langParameter])

    const {
        refetch: refetchContents,
        data: contents,
        isError: contentsError,
        isFetching: loadingContents,
    } = useGetIssueArticleContentQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
        articleNumber,
        language
    });

    const hadNoContent = useMemo(() => article && contentsError?.status === 404, [article, contentsError?.status]);


    if (isLoadingPeriodical || isLoadingIssue || loadingArticle || loadingContents) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (isErrorLoadingPeriodical || isErrorLoadingIssue || articleError || loadingArticles || articlesError || (contentsError && !hadNoContent)) {
        return (<Error title={t('issue.article.errors.loading.title')}
            detail={t('issue.article.errors.loading.subTitle')}
            onRetry={() => {
                refreshPeriodical();
                refreshIssue();
                refetchArticle();
                refetchArticles();
                refetchContents();
            }} />)
    }

    if (!article || !contents) {
        return (<Center h={100}><Text>{t('issue.article.empty.detail')}</Text></Center>);
    }

    const items = [
        (<Button variant="transparent" color="gray" size="compact-sm" component={Link}
            to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}`} leftSection={<IconPeriodical />} key='periodical'>
            {periodical.title}
        </Button>),
        (<Button variant="transparent" color="gray" size="compact-sm" onClick={open} leftSection={<IconIssueArticle />} key="issue">
            sds {article ? article.title : t('issue.articles')}
        </Button>),
    ]

    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(periodical?.frequency));
    const icon = <Center h={200}><IconPeriodical width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    const articleLinks = articles?.data.map(a => (
        { key: a.sequenceNumber, label: a.title, sequenceNumber: a.sequenceNumber, order: 1, icon: (<IconIssueArticle />) }
    ));

    const onArticleSelected = (_article) => {
        navigate(`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${_article.sequenceNumber}`)
        close();
    }

    return (<Container fluid ref={ref} className={`markdownReaderTheme--${readerTheme}`}>
        <Group justify="space-between" wrap="nowrap">
            <Breadcrumbs>{items}</Breadcrumbs>
            <Group wrap="nowrap">
                <ActionIcon onClick={openSetings} size={36} variant="default">
                    <IconSettings />
                </ActionIcon>
                <ActionIcon onClick={toggle} size={36} variant="default">
                    {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
                </ActionIcon>
            </Group>
        </Group>
        <If condition={!hadNoContent}
            elseChildren={<Text>{t('issuearticle.errors.contentNotFound.titleMissing')}</Text>}>
            <MarkdownReader
                markdown={contents?.text}
                layout={contents?.layout}
                viewType='scroll'
                subTitle={article?.title}
                showNavigation={false} />
        </If>
        <ReaderSetting opened={settingsOpened} onClose={closeSettings} language={language} showViews={false} />
        <Drawer opened={opened} onClose={close} title={<Group><IconIssueArticle />{t('book.chapters')}</Group>}>
            <TableOfContents title={<Title order={3}>{issue?.periodicalName}</Title>}
                image={issue.links?.image ?
                    <Image
                        h={200}
                        w="auto"
                        fit="contain"
                        radius="sm"
                        src={issue?.links?.image} /> :
                    icon
                }
                subTitle={<Title order={4}>{title}</Title>}
                links={articleLinks}
                onSelected={onArticleSelected}
                selectedKey={article?.id}
            />
        </Drawer>
    </Container>)
}

export default IssueArticlePage;