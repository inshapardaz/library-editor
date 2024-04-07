import { Link } from "react-router-dom";

// 3rd party libraries
import { Menu, Space, Typography } from "antd";

// Local imports
import helpers from "../../helpers";
import { useGetIssuesYearsQuery } from "../../features/api/issuesSlice";

// -----------------------------------------
const { Title, Paragraph } = Typography;
// ---------------------------------------------

const PeriodicalInfo = ({ libraryId, periodical, t, selectedYear }) => {
    const cover = periodical.links.image ? <img src={periodical.links.image} onError={helpers.setDefaultPeriodicalImage} width="100%" alt={periodical.title} /> : <img src={helpers.defaultPeriodicalImage} width="100%" alt={periodical.title} />;

    const { data: years, error, isFetching } = useGetIssuesYearsQuery({ libraryId, periodicalId: periodical.id }, { skip: !periodical });
    const yearsItems = years ? years.data.map(y => ({
        key: y.year,
        label: <Link to={`/libraries/${libraryId}/periodicals/${periodical.id}?year=${y.year}`}> {y.year} <Typography.Text type="secondary">{`(${y.count})`}</Typography.Text></Link>
    })) : [];

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                {cover}
                <Title level={2}>{periodical.title}</Title>
                <Paragraph ellipsis={{ rows: 4, tooltip: periodical.description }}>{periodical.description}</Paragraph>
                {
                    !isFetching && !error &&
                    <Menu mode="vertical" items={yearsItems} selectedKeys={[selectedYear]} />
                }
            </Space>
        </>
    );
};

export default PeriodicalInfo;
