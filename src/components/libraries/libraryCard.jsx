import { Link, useNavigate } from "react-router-dom";

// 3rd party libraries
import { Card, Typography } from 'antd';

// Internal Imports
import helpers from "../../helpers";
import styles from '../../styles/common.module.scss'
import { FaEdit } from "react-icons/fa";
import LibraryDeleteButton from "./libraryDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;
// ---------------------------------


const LibraryCard = ({ library, t }) => {
    const navigate = useNavigate();
    const cover = <img src={library.links.image || helpers.defaultLibraryImage} onError={helpers.setDefaultLibraryImage} className={styles["library__image"]} alt={library.name} />;
    const description = library.description ? (
        <Paragraph ellipsis type="secondary">
            {library.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("library.noDescription")}</Text>
    );

    const editLink = (
        <Link to={`/libraries/${library.id}/edit`}>
            <FaEdit />
        </Link>
    );


    return (<Card cover={cover} hoverable actions={[editLink, <LibraryDeleteButton
            library={library}
            t={t}
            type="ghost"
            size="small"
            onClick={() => navigate(`/libraries/${library.id}`)}
            />]}>
                <Link to={`/libraries/${library.id}`}>
                    <Card.Meta title={library.name} description={description}/>
                </Link>
        </Card>);
}


export default LibraryCard;
