import { Link } from "react-router-dom";

// 3rd party
import { Avatar, Popover, Space, Typography } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local imports
import helpers from "../../helpers/index";

// --------------------------------------------------
function AuthorAvatar({
    author,
    libraryId,
    t,
    showImage = true,
    showName = false,
}) {
    const avatar = author.links.image ? (
        <Avatar src={author.links.image}></Avatar>
    ) : (
        <Avatar src={helpers.defaultAuthorImage}></Avatar>
    );
    const popoverTitle = (
        <Space>
            {avatar}
            <Link to={`/libraries/${libraryId}/authors/${author.id}`}>
                <Typography>{author.name}</Typography>
            </Link>
        </Space>
    );

    const popoverContent = (
        <div>
            <p>
                <ImBooks />{" "}
                <Link
                    href={`/libraries/${libraryId}/books?author=${author.id}`}
                >
                    {t("author.bookCount", { count: author.bookCount })}
                </Link>
            </p>
            <p>
                <FaFeatherAlt />{" "}
                {author.type === "writer"
                    ? t("author.writer")
                    : t("author.poet")}
            </p>
        </div>
    );
    return (
        <Popover key={author.id} content={popoverContent} title={popoverTitle}>
            {showImage && avatar} {showName && author.name}
        </Popover>
    );
}

export default AuthorAvatar;
