import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List } from "antd";

// Local Import
import AuthorAvatar from "../author/authorAvatar";
import { ArticleCategory } from "./articleCategory";
import ArticleDeleteButton from "./articleDeleteButton";
// ------------------------------------------------------

function ArticleListItem({ libraryId, article, t }) {
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
            extra={[
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
                    key={`${article.id}-action-delete`}
                />,
            ]}
        >
            <List.Item.Meta
                avatar={avatar}
                title={title}
            />
        </List.Item>
    );
}

export default ArticleListItem;
