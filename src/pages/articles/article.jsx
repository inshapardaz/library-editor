import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


// 3rd party imports
import { Button, Space } from "antd";
import { FaPenFancy } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Markdown from 'markdown-to-jsx'

// Local imports
import * as styles from '~/src/styles/reader.module.scss';
import { useGetArticleQuery, useGetArticleContentsQuery } from "~/src/store/slices/articlesSlice";
import { selectedLanguage } from '~/src/store/slices/uiSlice';
import DataContainer from "~/src/components/layout/dataContainer";
import PageHeader from "~/src/components/layout/pageHeader";
import Loading from "~/src/components/common/loader";
import AuthorAvatar from "~/src/components/author/authorAvatar";
import ArticleDeleteButton from "~/src/components/articles/articleDeleteButton";
// ------------------------------------------------------

export default ArticlePage = () => {
    const navigate = useNavigate();
    const lang = useSelector(selectedLanguage);
    const { t } = useTranslation();
    const { libraryId, articleId, language } = useParams();
    const { data: article, isFetching } = useGetArticleQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });
    const { data: articleContents, error: contentError, isFetching: isLoadingContents } = useGetArticleContentsQuery({ libraryId, articleId, language: language ?? lang.key }, { skip: !libraryId || !article });

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
                <Button.Group key="button-group">
                    {article && article.contents.map(c => (
                        <Button key={c.language} onClick={() =>
                            navigate(`/libraries/${libraryId}/articles/${article.id}/contents/${c.language}`)
                        } disabled={c.language === (language ?? lang.key)}>
                            {t(`languages.${c.language}`)}
                        </Button>
                    ))}
                    <Button
                        key="edit-button"
                        block
                        icon={<FiEdit2 />}
                        onClick={() =>
                            navigate(`/libraries/${libraryId}/articles/${article.id}/contents/${language ?? lang.key}/edit`)
                        }
                    >
                        {t("actions.edit")}
                    </Button>
                    <ArticleDeleteButton
                        key="delete-button"
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
            ]} />
        <DataContainer busy={isFetching | isLoadingContents}
            error={!isArticlePresent || !hasAnyContent}
            errorTitle={t("article.errors.contentNotFound.titleMissing")}
            errorSubTitle={t("article.errors.contentNotFound.subTitleMissing")}
            empty={isContentMissing && hasAnyContent}
            emptyDescription={t("article.errors.contentNotFound.title", { language: t(`languages.${language ?? lang.key}`) }) + '\n' + t("article.errors.contentNotFound.subTitle")}
            emptyContent={
                article && article.contents.map(c =>
                    <Button type="default" key={c.language} onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}?language=${c.language}`)}>
                        {t(`languages.${c.language}`)}
                    </Button>)
            }>
            <div className={[article?.layout ? styles[`article_reader__${article?.layout}`] : styles[`article_reader__normal`],
            article?.language ? styles[`article_reader__${article.language}`] : styles[`article_reader__${lang}`]]}>
                <Markdown>
                    {articleContents?.text}
                </Markdown>
            </div>
        </DataContainer>
    </>);
}
