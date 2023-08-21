import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Col, Row } from "antd";
import { FaEdit } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import BooksList from "../../components/books/booksList";
import ContentsContainer from "../../components/layout/contentContainer";
import { useGetSeriesByIdQuery } from "../../features/api/seriesSlice";
import Loading from "../../components/common/loader";
import Error from "../../components/common/error";
import SeriesInfo from "../../components/series/seriesInfo";

//--------------------------------------------------------

function CategoryPage() {
    const { t } = useTranslation();
    const { libraryId, seriesId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "DateCreated";
    const sortDirection = searchParams.get("sortDirection") ?? "descending";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const { data: series, error, isFetching } = useGetSeriesByIdQuery({ libraryId, seriesId });

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const editButton = (
        <Link to={`/libraries/${libraryId}/series/${seriesId}/edit`}>
            <Button type="dashed" icon={<FaEdit />}>
                {t("actions.edit")}
            </Button>
        </Link>
    );
    return (
        <>
            <PageHeader title={series.name} icon={<ImBooks style={{ width: 36, height: 36 }} />} actions={editButton} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <SeriesInfo libraryId={libraryId} series={series} t={t} />
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <BooksList libraryId={libraryId} query={query} series={seriesId} sortBy={sortBy} sortDirection={sortDirection} status={status} pageNumber={pageNumber} pageSize={pageSize} />
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
}
export default CategoryPage;
