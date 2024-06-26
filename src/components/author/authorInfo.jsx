import React from 'react';
import { useNavigate, Link } from "react-router-dom";

// 3rd party libraries
import { Button, Space, Typography } from "antd";

// Local imports
import { FaFeatherAlt, ImBooks, FiEdit } from "/src/icons";
import { setDefaultAuthorImage, authorPlaceholderImage } from "/src/util";
import AuthorDeleteButton from "./authorDeleteButton";

// -----------------------------------------
const { Title, Paragraph } = Typography;
// ---------------------------------------------

const AuthorInfo = ({ libraryId, author, t }) => {
    const navigate = useNavigate();
    const cover = author.links.image ? <img src={author.links.image} onError={setDefaultAuthorImage} width="262" height="400" alt={author.name} /> : <img src={authorPlaceholderImage} width="136" height="300" alt={author.name} />;

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                {cover}
                <Title level={2}>{author.name}</Title>
                <Paragraph ellipsis={{ rows: 4, tooltip: author.description }}>{author.description}</Paragraph>
                <Space>
                    <ImBooks />
                    <Link to={`/libraries/${libraryId}/books?author=${author.id}`}>{t("author.bookCount", { count: author.bookCount })}</Link>
                </Space>
                <Space>
                    <FaFeatherAlt /> {author.authorType === "Writer" ? t("author.writer") : t("author.poet")}
                </Space>
                <Button block icon={<FiEdit />} onClick={() => navigate(`/libraries/${libraryId}/authors/${author.id}/edit`)}>
                    {t("actions.edit")}
                </Button>
                <AuthorDeleteButton block danger libraryId={libraryId} author={author} t={t}
                    onDeleted={() => navigate(`/libraries/${libraryId}/authors`)}>
                    {t('actions.delete')}
                </AuthorDeleteButton>
            </Space>
        </>
    );
};

export default AuthorInfo;
