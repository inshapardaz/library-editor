import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import { Button, App, Spin, Alert, Space } from "antd";
import { FaPenFancy, FaTimesCircle } from "react-icons/fa";

// Local imports
import { useGetArticleQuery, useGetArticleContentsQuery, useAddArticleContentsMutation, useUpdateArticleContentsMutation } from "../../features/api/articlesSlice";
import ContentsContainer from "../../components/layout/contentContainer";
import PageHeader from "../../components/layout/pageHeader";
import Error from "../../components/common/error";
import { selectedLanguage } from '../../features/ui/uiSlice';
import TextEditor from "../../components/textEditor";
import Error404 from "../404";
import LanguageSelect from "../../components/languageSelect";
import ArticleLayoutSelect from "../../components/articles/articleLayoutSelect";
import AuthorAvatar from "../../components/author/authorAvatar";

// ----------------------------------------------

const ArticleContentEditPage = () => {
    const { t } = useTranslation();
    const { libraryId, articleId, language } = useParams();

    const { message } = App.useApp();
    const navigate = useNavigate();
    const lang = useSelector(selectedLanguage);
    const searchLang = language ?? lang.key;
    const [layout, setLayout] = useState('normal');

    const { data: article, articleError, isFetchingArticle }
        = useGetArticleQuery(
            { libraryId, articleId: articleId, language: searchLang },
            { skip: !libraryId || !articleId || !searchLang });
    const { data: articleContents, error, isFetching }
        = useGetArticleContentsQuery(
            { libraryId, articleId: articleId, language: searchLang },
            { skip: !libraryId || !articleId || !searchLang || isFetchingArticle });

    const [addArticleContents, { isLoading: isAdding }] = useAddArticleContentsMutation();
    const [updateArticleContents, { isLoading: isUpdating }] = useUpdateArticleContentsMutation();

    const onSave = async (c) => {
        if (articleContents) {
            updateArticleContents({
                libraryId,
                articleId: articleId,
                language: searchLang,
                layout: layout,
                payload: c
            })
                .unwrap()
                .then(() => message.success(t("article.actions.edit.success")))
                .catch((_) => message.error(t("article.actions.edit.error")));
        } else {
            addArticleContents({
                libraryId,
                articleId: articleId,
                language: searchLang,
                layout: layout,
                payload: c
            })
                .unwrap()
                .then(() => message.success(t("article.actions.add.success")))
                .catch((_) => message.error(t("article.actions.add.error")));
        }
    };

    if (articleError) return <Error404 t={t} />

    if (error && error.status === '500') return <Error t={t} />;


    return (
        <>
            <PageHeader title={article && article.title} subTitle={
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
                icon={<FaPenFancy style={{ width: 36, height: 36 }} />}
                actions={
                    <Space>
                        <LanguageSelect
                            value={searchLang}
                            style={{ width: 120 }}
                            onChange={(val) => navigate(`/libraries/${libraryId}/articles/${article.id}/contents/${val}/edit`)}
                            disabled={isFetching | isAdding | isUpdating}
                        />
                        <ArticleLayoutSelect libraryId={libraryId}
                            placeholder={t("article.layout.placeholder")}
                            onChange={(val) => setLayout(val)}
                            value={layout}
                            disabled={isFetching | isAdding | isUpdating}
                            t={t} />
                        <Button onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}/contents/${searchLang}`)}
                            disabled={isFetching | isAdding | isUpdating}
                            icon={<FaTimesCircle />
                            } />
                    </Space>
                }
            />
            <ContentsContainer>
                <Spin spinning={isFetchingArticle | isFetching | isAdding | isUpdating}>
                    {error && error.status === 404 &&
                        <Alert message={t('article.messages.newContent')} type="warning" closable showIcon banner />}
                    <TextEditor value={articleContents?.text} language={searchLang} onSave={onSave} />
                </Spin>
            </ContentsContainer>
        </>
    );
};

export default ArticleContentEditPage;