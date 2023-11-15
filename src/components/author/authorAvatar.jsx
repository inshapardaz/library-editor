import { Link, useNavigate } from "react-router-dom";

// 3rd party
import { Avatar, Popover, Space, Typography } from "antd";
import { FaFeatherAlt, FaPenFancy } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local imports
import helpers from "../../helpers/index";
import { IconText } from "../common/iconText";

// --------------------------------------------------
function AuthorAvatar({
    author,
    libraryId,
    t,
    showImage = true,
    showName = false,
}) {
    const navigate = useNavigate();

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
        <Space direction="vertical">
            <IconText
                icon={FaFeatherAlt}
                link={false}
                text={author.type === "writer"
                ? t("author.writer")
                : t("author.poet")} />
            <IconText onClick={() => navigate(`/libraries/${libraryId}/books?author=${author.id}`)}
                icon={ImBooks}
                text={t("author.bookCount", { count: author.bookCount })} />
            <IconText onClick={() => navigate(`/libraries/${libraryId}/articles?author=${author.id}`)}
                icon={FaPenFancy}
                text={t("author.writingCount", { count: author.articleCount })} />
        </Space>
    );
    return (
        <Popover key={author.id} content={popoverContent} title={popoverTitle}>
            {showImage && avatar} {showName && author.name}
        </Popover>
    );
}

export default AuthorAvatar;
