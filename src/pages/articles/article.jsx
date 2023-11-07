import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";


// 3rd party imports
import { Button, Space } from "antd";
import { FaPenFancy } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

// Local imports
import { useGetArticleQuery, useGetArticleContentsQuery } from "../../features/api/articlesSlice";
import ContentsContainer from "../../components/layout/contentContainer";
import PageHeader from "../../components/layout/pageHeader";
import Error from "../../components/common/error";
import Loading from "../../components/common/loader";
import AuthorAvatar from "../../components/author/authorAvatar";
import ArticleDeleteButton from "../../components/articles/articleDeleteButton";

const ArticlePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, articleId } = useParams();
    const { data: article, error, isFetching } = useGetArticleQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });
    const { data: articleContents, errorContents, isFetchingContents } = useGetArticleContentsQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

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
                        <Button
                            block
                            icon={<FiEdit />}
                            onClick={() =>
                                navigate(`/libraries/${libraryId}/articles/${article.id}/edit`)
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
                <ContentsContainer>
                    {articleContents}
                </ContentsContainer>
    </>);
}

export default ArticlePage;
