import { Link } from "react-router-dom";

// 3rd party libraries
import { Col, Row, Typography } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local imports
import helpers from "../../helpers";


// -----------------------------------------
const { Title, Paragraph } = Typography;
// ---------------------------------------------

const AuthorInfo = ({ libraryId, author, t }) =>
{

    const cover = (author.links.image
        ? <img src={author.links.image} onError={helpers.setDefaultAuthorImage} width="262" height="400" alt={author.name}  />
        : <img src={helpers.defaultAuthorImage}  width="136" height="300" alt={author.name} />);

    return (<>
        <Row gutter={[8, 32]}>
            <Col span={24}>{ cover }</Col>
            <Col span={24}>
                <Title level={2}>{ author.name }</Title>
            </Col>
            <Col span={24}>
                <Paragraph ellipsis={{ rows: 4, tooltip : author.description }}>
                    { author.description }
                </Paragraph>
            </Col>
            <Col span={24}>
                <Row gutter={8}>
                    <Col><ImBooks /></Col>
                    <Col><Link to={`/libraries/${libraryId}/books?author=${author.id}`}>{t('author.bookCount', { count: author.bookCount })}</Link></Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={8}>
                    <Col><FaFeatherAlt /> </Col>
                    <Col>{author.type === 'writer' ? t('author.writer') : t('author.poet')}</Col>
                </Row>
            </Col>
        </Row>
    </>)
}

export default AuthorInfo;
