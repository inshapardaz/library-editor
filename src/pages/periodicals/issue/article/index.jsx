
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { ActionIcon, Center, Container, Group, rem, Skeleton, Text } from '@mantine/core';
import { useDisclosure, useFullscreen } from '@mantine/hooks';

// Local Import
import { useGetArticleQuery, useGetArticleContentsQuery } from '@/store/slices/issues.api';
import { IconFullScreen, IconFullScreenExit, IconSettings } from '@/components/icon';
import Error from '@/components/error';
import ReaderSetting from "@/components/reader/ebook/readerSettings";
import MarkdownReader from "@/components/reader/ebook/markdownReader";
// -----------------------------------------
const PRIMARY_COL_HEIGHT = rem(300);
//--------------------------------------------
const IssueArticlePage = () => {
    const { t } = useTranslation();
    const { libraryId, periodicalId, volumeNumber, issueNumber, articleNumber } = useParams();
    const [searchParams] = useSearchParams();
    const language = searchParams.get("language") ?? 'ur';
    const readerTheme = useSelector(state => state.ui.readerTheme);

    const { ref, toggle, fullscreen } = useFullscreen();
    const [settingsOpened, { open: openSetings, close: closeSettings }] = useDisclosure(false);

    const {
        refetch: refetchArticle,
        data: article,
        isError: articleError,
        isFetching: loadingArticle,
    } = useGetArticleQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
        articleNumber
    });

    const {
        refetch: refetchContents,
        data: contents,
        isError: contentsError,
        isFetching: loadingContents,
    } = useGetArticleContentsQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
        articleNumber
    });

    if (loadingArticle || loadingContents) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (articleError || contentsError) {
        return (<Error title={t('issue.article.errors.loading.title')}
            detail={t('issue.article.errors.loading.subTitle')}
            onRetry={() => {
                refetchArticle();
                refetchContents();
            }} />)
    }
    if (!article || !contents) {
        return (<Center h={100}><Text>{t('issue.article.empty.detail')}</Text></Center>);
    }

    return (<Container fluid ref={ref} className={`markdownReaderTheme--${readerTheme}`}>
        <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
                <ActionIcon onClick={openSetings} size={36} variant="default">
                    <IconSettings />
                </ActionIcon>
                <ActionIcon onClick={toggle} size={36} variant="default">
                    {fullscreen ? <IconFullScreenExit /> : <IconFullScreen />}
                </ActionIcon>
            </Group>
        </Group>
        <MarkdownReader
            markdown={contents?.text}
            layout={contents?.layout}
            viewType='scroll'
            subTitle={article?.title}
            showNavigation={false} />
        <ReaderSetting opened={settingsOpened} onClose={closeSettings} language={language} showViews={false} />
    </Container>)
}

export default IssueArticlePage;