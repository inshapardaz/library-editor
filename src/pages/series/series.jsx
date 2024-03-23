import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Col, Row, Space } from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import BooksList from "../../components/books/booksList";
import ContentsContainer from "../../components/layout/contentContainer";
import { useGetSeriesByIdQuery } from "../../features/api/seriesSlice";
import Loading from "../../components/common/loader";
import Error from "../../components/common/error";
import SeriesDeleteButton from "../../components/series/seriesDeleteButton";
import { FiEdit } from "react-icons/fi";
import ButtonGroup from "antd/es/button/button-group";
import helpers from "../../helpers";

//--------------------------------------------------------

function SeriesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
    const cover = series.links.image ? <img src={series.links.image} onError={helpers.setDefaultSeriesImage} width="262" height="400" alt={series.name} /> : <img src={helpers.defaultSeriesImage} width="136" height="300" alt={series.name} />;

    const actions = [<ButtonGroup>
        <Button icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/series/${series.id}/edit`)}>
            {t("actions.edit")}
        </Button>
        <Button icon={<FaCloudUploadAlt />} onClick={() => navigate(`/libraries/${libraryId}/books/upload`)}>
            {t("books.actions.upload.label")}
        </Button>
        <SeriesDeleteButton libraryId={libraryId} series={series} t={t}
            onDeleted={() => navigate(`/libraries/${libraryId}/series`)}>
            {t('actions.delete')}
        </SeriesDeleteButton>
    </ButtonGroup>];
    return (
        <>
            <PageHeader
                title={series.name}
                subTitle={(<Space>
                    <ImBooks />
                    {t("series.bookCount", { count: series.bookCount })}
                </Space>)}
                icon={<ImBooks style={{ width: 36, height: 36 }} />}
                actions={actions} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        {cover}
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <BooksList libraryId={libraryId} query={query} series={seriesId} sortBy={sortBy} sortDirection={sortDirection} status={status} pageNumber={pageNumber} pageSize={pageSize} />
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
}
export default SeriesPage;
