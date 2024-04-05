import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Button, Divider, List } from "antd";

// Local Import
import AuthorAvatar from "../author/authorAvatar";
import { ArticleCategory } from "./articleCategory";
import ArticleDeleteButton from "./articleDeleteButton";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
// ------------------------------------------------------

function ArticleListItem({ libraryId, article, t }) {
    const navigate = useNavigate();
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

    const renderContentLinks = () => {
        if (article && article.contents && article.contents.length > 0) {
            return (article.contents.map(c => <Button type="ghost"
                size="small"
                key={`${article.id}-action-edit-content-${c.language}`}
                onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}/contents/${c.language}/edit`)} >
                {t(`languages.${c.language}`)}
            </Button>))
        }
        else {
            return (<Button type="ghost"
                size="small"
                onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}/contents/add`)} >
                <FaPlusCircle />
            </Button>)
        }
    }

    return (
        <List.Item
            key={article.id}
            extra={<Button.Group>
                <Button key={`${article.id}-action-edit`}
                    onClick={() => navigate(`/libraries/${libraryId}/articles/${article.id}/edit`)}
                    type="ghost"
                    size="small">
                    <FaEdit />
                </Button>
                <Divider type="vertical" />
                {renderContentLinks()}
                <Divider type="vertical" />
                <ArticleDeleteButton
                    libraryId={libraryId}
                    article={article}
                    t={t}
                    type="ghost"
                    size="small"
                    key={`${article.id}-action-delete`}
                />
            </Button.Group>}
        >
            <List.Item.Meta
                avatar={avatar}
                title={title}
                description={<ArticleCategory
                    key={`${article.id}-action-categories`}
                    justList
                    article={article}
                />}
            />
        </List.Item>
    );
}

export default ArticleListItem;
