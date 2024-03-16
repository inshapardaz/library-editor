import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Layout, theme, Button } from "antd";
import { FaBook, FaCloudUploadAlt, FaPlus } from "react-icons/fa";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import BooksList from "../../components/books/booksList";
import ContentsContainer from "../../components/layout/contentContainer";
import BooksSideBar from "../../components/books/booksSideBar";
import SortDirection from "../../models/sortDirection";

//--------------------------------------------------------
const { Content, Sider } = Layout;
//--------------------------------------------------------

function BooksHomePage() {
    const { t } = useTranslation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const author = searchParams.get("author");
    const categories = searchParams.get("categories");
    const series = searchParams.get("series");
    const favorite = searchParams.get("favorite");
    const read = searchParams.get("read");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "title";
    const sortDirection =
        searchParams.get("sortDirection") ?? SortDirection.Descending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const addButton = (
        <Link to={`/libraries/${libraryId}/books/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("book.actions.add.label")}
            </Button>
        </Link>
    );
    const uploadButton =(
        <Link to={`/libraries/${libraryId}/books/upload`}>
            <Button type="dashed" icon={<FaCloudUploadAlt />}>
                {t("books.actions.upload.label")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader
                title={t("books.title")}
                icon={<FaBook style={{ width: 36, height: 36 }} />}
                actions={[addButton, uploadButton]}
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
                        <BooksSideBar
                            libraryId={libraryId}
                            selectedCategories={categories}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            favorite={favorite}
                            read={read}
                        />
                    </Sider>
                    <Content>
                        <BooksList
                            libraryId={libraryId}
                            query={query}
                            author={author}
                            categories={categories}
                            series={series}
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
}
export default BooksHomePage;
