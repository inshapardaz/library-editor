import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";
import { ImBooks } from "react-icons/im";
import { FaEdit, FaPenFancy } from "react-icons/fa";

// Local Imports
import * as styles from "~/src/styles/common.module.scss";
import { authorPlaceholderImage, setDefaultAuthorImage } from "~/src/util";
import IconText from "~/src/components/common/iconText";
import AuthorDeleteButton from "./authorDeleteButton";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function AuthorListItem({ libraryId, author, t }) {
    const navigate = useNavigate();
    const avatar = <img src={author.links.image || authorPlaceholderImage} onError={setDefaultAuthorImage} className={styles["author__image--small"]} alt={author.name} />;
    const title = <Link to={`/libraries/${libraryId}/authors/${author.id}`}>{author.name}</Link>;
    const description = author.description ? (
        <Paragraph ellipsis type="secondary">
            {author.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("author.noDescription")}</Text>
    );
    const bookCount = (
        <IconText href={`/libraries/${libraryId}/books?author=${author.id}`}
            icon={ImBooks}
            text={t("author.bookCount", { count: author.bookCount })}
            key="auhtor-book-count" />
    );
    const writingsCount = (
        <IconText href={`/libraries/${libraryId}/articles?author=${author.id}`}
            icon={FaPenFancy}
            text={t("author.writingCount", { count: author.articleCount })}
            key="author-writings-count" />
    );
    const editLink = (
        <IconText href={`/libraries/${libraryId}/authors/${author.id}/edit`}
            icon={FaEdit}
            text={t("actions.edit")}
            key="author-edit" />
    );
    const deleteAuthor = <AuthorDeleteButton libraryId={libraryId} author={author} t={t} type="ghost" size="small" />;

    return (
        <List.Item key={author.id} actions={[bookCount, writingsCount, editLink, deleteAuthor]}>
            <List.Item.Meta title={title} avatar={avatar} description={description} />
        </List.Item>
    );
}

export default AuthorListItem;
