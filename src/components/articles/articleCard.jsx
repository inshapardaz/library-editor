import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Card } from "antd";
import { FiEdit } from "react-icons/fi";

// Local Imports
import styles from "../../styles/common.module.scss";
import AuthorAvatar from "../author/authorAvatar";
import helpers from "../../helpers/index";
import ArticleDeleteButton from "./articleDeleteButton";
// --------------------------------------------

function ArticleCard({ libraryId, article, t }) {
    const navigate = useNavigate();

    const cover = article.links.image ? (
        <img
            src={article.links.image}
            onError={helpers.setDefaultArticleImage}
            className={styles["article__image"]}
            alt={article.title}
        />
    ) : (
        <img
            src={helpers.defaultArticleImage}
            className={styles["article__image"]}
            alt={article.title}
        />
    );
    const avatar = (
        <Avatar.Group maxCount="2" size="large">
            {article.authors.map((author) => (
                <AuthorAvatar
                    key={author.id}
                    libraryId={libraryId}
                    author={author}
                    t={t}
                />
            ))}
        </Avatar.Group>
    );
    const edit = (
        <Link to={`/libraries/${libraryId}/articles/${article.id}/edit`}>
            <FiEdit />
        </Link>
    );
    const deleteAction = (
        <ArticleDeleteButton
            libraryId={libraryId}
            article={article}
            t={t}
            type="ghost"
            size="small"
        />
    );
    return (
        <Card
            key={article.id}
            cover={cover}
            hoverable
            onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}`)}
            actions={[edit, deleteAction]}
        >
            <Link to={`/libraries/${libraryId}/articles/${article.id}`}>
                <Card.Meta
                    avatar={avatar}
                    title={article.title}
                />
            </Link>
        </Card>
    );
}

export default ArticleCard;
