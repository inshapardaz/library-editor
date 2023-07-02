import { useNavigate, Link } from "react-router-dom";

// 3rd party libraries
import { Button, Space, Typography } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { FiEdit } from "react-icons/fi";

// Local imports
import helpers from "../../helpers";
import PeriodicalDeleteButton from "./periodicalDeleteButton";

// -----------------------------------------
const { Title, Paragraph } = Typography;
// ---------------------------------------------

const PeriodicalInfo = ({ libraryId, periodical, t }) => {
    const navigate = useNavigate();
    const cover = periodical.links.image ? <img src={periodical.links.image} onError={helpers.setDefaultPeriodicalImage} width="262" height="400" alt={periodical.title} /> : <img src={helpers.defaultPeriodicalImage} height="300" alt={periodical.title} />;

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                {cover}
                <Title level={2}>{periodical.title}</Title>
                <Paragraph ellipsis={{ rows: 4, tooltip: periodical.description }}>{periodical.description}</Paragraph>
                <Button block icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodical.id}/edit`)}>
                    {t("actions.edit")}
                </Button>
                <PeriodicalDeleteButton block danger libraryId={libraryId} periodical={periodical} t={t}
                    onDeleted={() => navigate(`/libraries/${libraryId}/periodicals`)}>
                        {t('actions.delete')}
                </PeriodicalDeleteButton>
            </Space>
        </>
    );
};

export default PeriodicalInfo;
