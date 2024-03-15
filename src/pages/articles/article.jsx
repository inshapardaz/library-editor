import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";


// 3rd party imports
import { Button, Space } from "antd";
import { FaPenFancy } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

// Local imports
import { useGetArticleQuery, useGetArticleContentsQuery } from "../../features/api/articlesSlice";
import { selectedLanguage } from '../../features/ui/uiSlice';
import styles from '../../styles/reader.module.scss';
import DataContainer from "../../components/layout/dataContainer";
import PageHeader from "../../components/layout/pageHeader";
import Loading from "../../components/common/loader";
import AuthorAvatar from "../../components/author/authorAvatar";
import ArticleDeleteButton from "../../components/articles/articleDeleteButton";
import ReactMarkdown from "react-markdown";

const ArticlePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lang = useSelector(selectedLanguage);
    const searchLang = searchParams.get("language") ??lang.key;
    const { t } = useTranslation();
    const { libraryId, articleId } = useParams();
    const { data: article, isFetching } = useGetArticleQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });
    const { data: articleContents, error: contentError, isFetching : isLoadingContents } = useGetArticleContentsQuery({ libraryId, articleId, language: searchLang }, { skip: !libraryId || !article });

    if (isFetching) return <Loading />

    const isArticlePresent = !!article;
    const hasAnyContent = article?.contents.length > 0;
    const isContentMissing = contentError && contentError.status === 404;

    const title = article ? article.title : t("article.actions.add.label");

    return (<>
            <PageHeader title={title}
                icon={<FaPenFancy style={{ width: 36, height: 36 }} />}
                subTitle={
                    <Space>
                        {article &&
                            article.authors.map((author) => (
                                <AuthorAvatar
                                    key={author.id}
                                    libraryId={libraryId}
                                    author={author}
                                    t={t}
                                    showName={true}
                                />
                            ))}
                    </Space>
                }
                actions={[
                    <Button.Group>
                        {article && article.contents.map(c => (<Button key={c.language} onClick={() =>
                                navigate(`/libraries/${libraryId}/articles/${article.id}?language=${c.language}`)
                            } disabled={c.language === searchLang}>
                            {t(`languages.${c.language}`)}
                        </Button>))}
                        <Button
                            block
                            icon={<FiEdit />}
                            onClick={() =>
                                navigate(`/libraries/${libraryId}/articles/${article.id}/edit?section=contents&language=${searchLang}`)
                            }
                        >
                            {t("actions.edit")}
                        </Button>
                        <ArticleDeleteButton
                            block
                            size="large"
                            libraryId={libraryId}
                            article={article}
                            t={t}
                            onDeleted={() => navigate(`/libraries/${libraryId}/articles`)}
                        >
                            {t("actions.delete")}
                        </ArticleDeleteButton>
                    </Button.Group>,
                ]}/>
                <DataContainer busy={isFetching | isLoadingContents}
                    error={!isArticlePresent || !hasAnyContent}
                    errorTitle={ t("article.errors.contentNotFound.titleMissing")}
                    errorSubTitle={t("article.errors.contentNotFound.subTitleMissing")}
                    empty={isContentMissing && hasAnyContent}
                    emptyDescription={t("article.errors.contentNotFound.title", { language : t(`languages.${searchLang}`) }) + '\n' +  t("article.errors.contentNotFound.subTitle")}
                    emptyContent={
                        article && article.contents.map(c =>
                        <Button type="default" key={c.language} onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}?language=${c.language}`)}>
                            {t(`languages.${c.language}`)}
                        </Button>)
                    }>
                    <div className={[article?.layout ? styles[`article_reader__${article?.layout}`] : styles[`article_reader__normal`],
                          article?.language ? styles[`article_reader__${article.language}`] : styles[`article_reader__${lang}`]]}>
                        <ReactMarkdown children={articleContents?.text} />
                    </div>
                </DataContainer>
    </>);
}

export default ArticlePage;
