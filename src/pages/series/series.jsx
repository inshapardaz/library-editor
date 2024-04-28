import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Col, Row, Space } from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { FiEdit } from "react-icons/fi";

// Local Imports
import { useGetSeriesByIdQuery } from "~/src/store/slices/seriesSlice";
import { setDefaultSeriesImage, seriesPlaceholderImage } from "~/src/util";
import PageHeader from "~/src/components/layout/pageHeader";
import BooksList from "~/src/components/books/booksList";
import ContentsContainer from "~/src/components/layout/contentContainer";
import Loading from "~/src/components/common/loader";
import Error from "~/src/components/common/error";
import SeriesDeleteButton from "~/src/components/series/seriesDeleteButton";

//--------------------------------------------------------
const ButtonGroup = Button.Group;
//--------------------------------------------------------

const SeriesPage = () => {
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
    const cover = series.links.image ? <img key="series-image" src={series.links.image} onError={setDefaultSeriesImage} width="262" height="400" alt={series.name} /> : <img key="default-image" src={seriesPlaceholderImage} width="136" height="300" alt={series.name} />;

    const actions = [<ButtonGroup key="button-group">
        <Button key="edit-button" icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/series/${series.id}/edit`)}>
            {t("actions.edit")}
        </Button>
        <Button key="upload-button" icon={<FaCloudUploadAlt />} onClick={() => navigate(`/libraries/${libraryId}/books/upload`)}>
            {t("books.actions.upload.label")}
        </Button>
        <SeriesDeleteButton key="delete-button" libraryId={libraryId} series={series} t={t}
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
};

export default SeriesPage;
