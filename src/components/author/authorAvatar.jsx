import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// 3rd party
import { Avatar, Popover, Space, Typography } from "antd";
import { FaFeatherAlt, FaPenFancy } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local imports
import { authorPlaceholderImage } from "/src/util";
import IconText from "/src/components/common/iconText";

// --------------------------------------------------
const AuthorAvatar = ({
    author,
    libraryId,
    t,
    showImage = true,
    showName = false,
}) => {
    const navigate = useNavigate();

    const avatar = author.links.image ? (
        <Avatar src={author.links.image}></Avatar>
    ) : (
        <Avatar src={authorPlaceholderImage}></Avatar>
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
            <IconText icon={FaFeatherAlt}
                text={author.type === "writer"
                    ? t("author.writer")
                    : t("author.poet")} />
            <IconText href={`/libraries/${libraryId}/books?author=${author.id}`}
                icon={ImBooks}
                text={t("author.bookCount", { count: author.bookCount })} />
            <IconText href={`/libraries/${libraryId}/articles?author=${author.id}`}
                icon={FaPenFancy}
                text={t("author.writingCount", { count: author.articleCount })} />
        </Space>
    );
    return (
        <Popover key={author.id} content={popoverContent} title={popoverTitle}>
            {showImage && avatar} {showName && author.name}
        </Popover>
    );
};

export default AuthorAvatar;
