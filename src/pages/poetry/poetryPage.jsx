import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Ui Library Import
import { ActionIcon, Breadcrumbs, Button, Container, Grid, Group, rem, Skeleton } from "@mantine/core";
import { useDisclosure, useFullscreen } from "@mantine/hooks";

// Local imports
import { useGetArticleQuery, useGetArticleContentsQuery } from "@/store/slices/articles.api";
import { IconPoetries, IconPoetry, IconFullScreen, IconFullScreenExit, IconSettings } from '@/components/icon';
import Error from '@/components/error';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import ReaderSetting from "@/components/reader/ebook/readerSettings";
import MarkdownReader from "@/components/reader/ebook/markdownReader";
//----------------------------------
const getLanguage = (article, language) => {
    if (article && article.contents && article.contents[0]) {
        if (language) {
            var foundContent = article.contents.find(d => d.language === language);
            return foundContent?.language ?? 'ur';
        }
        return article.contents[0].language;
    }

    return 'ur';
}

const PRIMARY_COL_HEIGHT = rem(300);
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

//----------------------------------
const PoetryPage = () => {
    const { t } = useTranslation();
    const { libraryId, poetryId } = useParams();
    const [searchParams] = useSearchParams();
    const language = searchParams.get("language") ?? 'ur';
    const readerTheme = useSelector(state => state.ui.readerTheme);

    const { ref, toggle, fullscreen } = useFullscreen();
    const [settingsOpened, { open: openSetings, close: closeSettings }] = useDisclosure(false);

    const {
        refetch,
        data: article,
        isError: isErrorLoadingArticle,
        isFetching: isLoadingArticle,
    } = useGetArticleQuery({
        libraryId, articleId: poetryId
    });

    const {
        refetch: refetchContent,
        data: articleContent,
        isError: isErrorLoadingContent,
        isFetching: isLoadingContent,
    } = useGetArticleContentsQuery({
        libraryId,
        articleId: poetryId,
        language: getLanguage(article, language)
    }, {
        skip: isLoadingArticle || isErrorLoadingArticle || !libraryId || poetryId === null || getLanguage(article, language) == null
    });

    if (isLoadingArticle || isLoadingContent) {
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

    if (isErrorLoadingArticle || isErrorLoadingContent) {
        return (<Container fluid mt="sm">
            <Error title={t('poetry.error.loading.title')}
                detail={t('poetry.error.loading.detail')}
                onRetry={() => { refetch() && refetchContent() }} />
        </Container>)
    }

    const items = [
        (<Button variant="transparent" color="gray" size="compact-sm" component={Link} to={`/libraries/${libraryId}/poetry`} leftSection={<IconPoetries />} key='poetries'>
            {t('header.poetry')}
        </Button>),
        (<Button variant="transparent" color="gray" size="compact-sm" onClick={open} leftSection={<IconPoetry />} key="chapter">
            {article?.title}
        </Button>),
    ]

    return (<Container fluid ref={ref} className={`markdownReaderTheme--${readerTheme}`}>
        <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap" visibleFrom="md">
                <Breadcrumbs>{items}</Breadcrumbs>
                <AuthorsAvatar libraryId={libraryId} authors={article?.authors} />
            </Group>
            <Group wrap="nowrap" hiddenFrom="md">
                <Breadcrumbs>{items}</Breadcrumbs>
            </Group>
            <span />
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
            markdown={articleContent?.text}
            layout={articleContent?.layout}
            viewType='scroll'
            showNavigation={false} />
        <ReaderSetting opened={settingsOpened} onClose={closeSettings} language={language} showViews={false} />
    </Container>)

}

export default PoetryPage;