import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Card } from "antd";
import { FiEdit } from "react-icons/fi";

// Local Imports
import * as styles from "~/src/styles/common.module.scss";
import { articlePlaceholderImage, setDefaultArticleImage } from "~/src/util";
import AuthorAvatar from "~/src/components/author/authorAvatar";
import ArticleDeleteButton from "./articleDeleteButton";
// --------------------------------------------

function ArticleCard({ libraryId, article, t }) {
    const navigate = useNavigate();

    const cover = article.links.image ? (
        <img
            src={article.links.image}
            onError={setDefaultArticleImage}
            className={styles["article__image"]}
            alt={article.title}
        />
    ) : (
        <img
            src={articlePlaceholderImage}
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
