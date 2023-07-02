import { useNavigate, Link } from "react-router-dom";

// 3rd party libraries
import { Button, Space, Typography } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { FiEdit } from "react-icons/fi";

// Local imports
import helpers from "../../helpers";
import SeriesDeleteButton from "./seriesDeleteButton";

// -----------------------------------------
const { Title, Paragraph } = Typography;
// ---------------------------------------------

const SeriesInfo = ({ libraryId, series, t }) => {
    const navigate = useNavigate();
    const cover = series.links.image ? <img src={series.links.image} onError={helpers.setDefaultSeriesImage} width="262" height="400" alt={series.name} /> : <img src={helpers.defaultSeriesImage} width="136" height="300" alt={series.name} />;

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                {cover}
                <Title level={2}>{series.name}</Title>
                <Paragraph ellipsis={{ rows: 4, tooltip: series.description }}>{series.description}</Paragraph>
                <Space>
                    <ImBooks />
                    <Link to={`/libraries/${libraryId}/books?series=${series.id}`}>{t("series.bookCount", { count: series.bookCount })}</Link>
                </Space>
                <Button block icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/series/${series.id}/edit`)}>
                    {t("actions.edit")}
                </Button>
                <SeriesDeleteButton block danger libraryId={libraryId} series={series} t={t}
                    onDeleted={() => navigate(`/libraries/${libraryId}/series`)}>
                        {t('actions.delete')}
                </SeriesDeleteButton>
            </Space>
        </>
    );
};

export default SeriesInfo;
