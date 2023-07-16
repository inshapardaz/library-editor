import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// 3rd party libraries
import { Space, Tabs } from "antd";
import { FaBook, FaFeather, FaSearch } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import ContentsContainer from "../../components/layout/contentContainer";
import BooksList from "../../components/books/booksList";
import AuthorsList from "../../components/author/authorsList";
import PeriodicalsList from "../../components/periodicals/periodicalsList";

export default function SearchPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section");
    const query = searchParams.get("query");
    const author = searchParams.get("author");
    const authorType = searchParams.get("authorType");
    const categories = searchParams.get("categories");
    const series = searchParams.get("series");
    const favorite = searchParams.get("favorite");
    const read = searchParams.get("read");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "DateCreated";
    const sortDirection = searchParams.get("sortDirection") ?? "descending";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const tabs = [
        {
            key: "books",
            label: (
                <Space gutter={2}>
                    <FaBook />
                    {t("books.title")}
                </Space>
            ),
            children: (
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
            ),
        },
        {
            key: "authors",
            label: (
                <Space gutter={2}>
                    <FaFeather />
                    {t("authors.title")}
                </Space>
            ),
            children: (
                <AuthorsList
                    libraryId={libraryId}
                    query={query}
                    authorType={authorType}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                />
            ),
        },
        {
            key: "periodicals",
            label: (
                <Space gutter={2}>
                    <ImNewspaper />
                    {t("periodicals.title")}
                </Space>
            ),
            children: (
                <PeriodicalsList
                    libraryId={libraryId}
                    query={query}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                />
            ),
        },
    ];

    const onChange = (key) => {
        navigate(
            `/libraries/${libraryId}/search?section=${key}&query=${query}`
        );
    };

    return (
        <>
            <PageHeader title={t("search.header")} icon={<FaSearch />} />
            <ContentsContainer>
                <Tabs
                    defaultActiveKey={section}
                    items={tabs}
                    onChange={onChange}
                />
            </ContentsContainer>
        </>
    );
}
