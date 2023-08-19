import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";

// Local Import
import styles from "../../styles/common.module.scss";
import helpers from "../../helpers/index";
import { FaEdit } from "react-icons/fa";
import LibraryDeleteButton from "./libraryDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function LibraryListItem({ library, t }) {
    const cover = <img src={library.links.image || helpers.defaultLibraryImage} onError={helpers.setDefaultLibraryImage} className={styles["library__image"]} alt={library.name} />;

    const title = (
        <Link to={`/libraries/${library.id}/`}>
            {library.name}
        </Link>
    );

    const description = library.description ? (
        <Paragraph type="secondary" ellipsis>
            {library.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("library.description.noDescription")}</Text>
    );

    return (
        <List.Item
            key={library.id}
            actions={[
                <Link to={`/libraries/${library.id}/edit`}>
                    <FaEdit />
                </Link>,
                <LibraryDeleteButton
                    library={library}
                    t={t}
                    type="ghost"
                    size="small"
                />,
            ]}
            extra={cover}
        >
            <List.Item.Meta
                title={title}
                description={description}
            />
        </List.Item>
    );
}

export default LibraryListItem;
