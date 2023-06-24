import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Card, Typography } from "antd";
import { ImBooks } from "react-icons/im";
import { FaPenFancy, FaEdit } from "react-icons/fa";

// Local Imports
import styles from "../../styles/common.module.scss";
import { IconText } from "../common/iconText";
import helpers from "../../helpers/index";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function AuthorCard({ libraryId, author, t }) {
    const cover = <img src={author.links.image || helpers.defaultAuthorImage} onError={helpers.setDefaultAuthorImage} className={styles["author__image"]} alt={author.name} />;
    const description = author.description ? (
        <Paragraph ellipsis type="secondary">
            {author.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("author.noDescription")}</Text>
    );
    const bookCount = (
        <Link to={`/libraries/${libraryId}/books?author=${author.id}`}>
            <IconText icon={ImBooks} text={t("author.bookCount", { count: author.bookCount })} key="auhtor-book-count" />
        </Link>
    );
    const writingsCount = (
        <Link to={`/libraries/${libraryId}/writings?author=${author.id}`}>
            <IconText icon={FaPenFancy} text={t("author.writingCount", { count: 0 })} key="author-writings-count" />
        </Link>
    );

    const editLink = (
        <Link to={`/libraries/${libraryId}/authors/${author.id}/edit`}>
            <IconText icon={FaEdit} text={t("actions.edit")} key="author-edit" />
        </Link>
    );

    return (
        <Link to={`/libraries/${libraryId}/authors/${author.id}`}>
            <Card key={author.id} cover={cover} hoverable actions={[editLink, bookCount, writingsCount]}>
                <Card.Meta title={author.name} description={description} />
            </Card>
        </Link>
    );
}

export default AuthorCard;
