import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List } from "antd";

// Local Import
import styles from "../../styles/common.module.scss";
import AuthorAvatar from "../author/authorAvatar";
import { ArticleCategory } from "./articleCategory";
import helpers from "../../helpers/index";
import ArticleDeleteButton from "./articleDeleteButton";
// ------------------------------------------------------

function ArticleListItem({ libraryId, article, t }) {
    const cover = article.links.image ? (
        <img
            src={article.links.image}
            onError={helpers.setDefaultArticleImage}
            className={styles["article__image--small"]}
            alt={article.title}
        />
    ) : (
        <img
            src={helpers.defaultArticleImage}
            className={styles["article__image--small"]}
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
    const title = (
        <Link to={`/libraries/${libraryId}/articles/${article.id}`}>
            {article.title}
        </Link>
    );

    return (
        <List.Item
            key={article.id}
            actions={[
                <ArticleCategory
                    key={`${article.id}-action-categories`}
                    justList
                    article={article}
                />,
                <ArticleDeleteButton
                    libraryId={libraryId}
                    article={article}
                    t={t}
                    type="ghost"
                    size="small"
                />,
            ]}
            extra={cover}
        >
            <List.Item.Meta
                avatar={avatar}
                title={title}
            />
        </List.Item>
    );
}

export default ArticleListItem;
