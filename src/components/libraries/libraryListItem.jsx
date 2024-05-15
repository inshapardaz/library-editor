import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";
import { FaEdit } from "react-icons/fa";

// Local Import
import * as styles from "~/src/styles/common.module.scss";
import { libraryPlaceholderImage, setDefaultLibraryImage } from "~/src/util";
import IconText from "~/src/components/common/iconText";
import LibraryDeleteButton from "./libraryDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const LibraryListItem = ({ library, t }) => {
    const cover = <img src={library.links.image || libraryPlaceholderImage} onError={setDefaultLibraryImage} className={styles["library__image"]} alt={library.name} />;

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
                <IconText icon={FaEdit} key="library-edit"
                    href={`/libraries/${library.id}/edit`} />,
                <LibraryDeleteButton
                    key={`delete-${library.id}`}
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
};

export default LibraryListItem;
