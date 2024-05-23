import React from 'react';
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Layout, theme, Button } from "antd";
import { FaPenFancy, FaPlus } from "/src/icons";

// Local Imports
import SortDirection from "/src/models/sortDirection";
import PageHeader from "/src/components/layout/pageHeader";
import ContentsContainer from "/src/components/layout/contentContainer";
import ArticlesList from "/src/components/articles/articlesList";
import ArticlesSideBar from "/src/components/articles/articlesSideBar";

//--------------------------------------------------------
const { Content, Sider } = Layout;
//--------------------------------------------------------

const ArticleHomePage = () => {
    const { t } = useTranslation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const author = searchParams.get("author");
    const categories = searchParams.get("categories");
    const type = searchParams.get("type");
    const favorite = searchParams.get("favorite");
    const read = searchParams.get("read");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "title";
    const sortDirection =
        searchParams.get("sortDirection") ?? SortDirection.Descending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const addButton = (
        <Link to={`/libraries/${libraryId}/articles/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("article.actions.add.label")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader
                title={t("articles.title")}
                icon={<FaPenFancy style={{ width: 36, height: 36 }} />}
                actions={addButton}
            />
            <ContentsContainer>
                <Layout
                    style={{ padding: "24px 0", background: colorBgContainer }}
                >
                    <Sider
                        style={{ background: colorBgContainer }}
                        width={200}
                        breakpoint="lg"
                        collapsedWidth={0}
                    >
                        <ArticlesSideBar
                            libraryId={libraryId}
                            selectedCategories={categories}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            favorite={favorite}
                            read={read}
                        />
                    </Sider>
                    <Content>
                        <ArticlesList
                            libraryId={libraryId}
                            query={query}
                            author={author}
                            categories={categories}
                            type={type}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            favorite={favorite}
                            read={read}
                            status={status}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                        />
                    </Content>
                </Layout>
            </ContentsContainer>
        </>
    );
};

export default ArticleHomePage;
