import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Card, Typography } from "antd";

// Local Imports
import "./styles.scss";
import { ImBooks, FaPenFancy, FaEdit } from "/src/icons";
import { authorPlaceholderImage, setDefaultAuthorImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import AuthorDeleteButton from "./authorDeleteButton";

// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const AuthorCard = ({ libraryId, author, t }) => {
    const navigate = useNavigate();

    const cover = <img src={author.links.image || authorPlaceholderImage} onError={setDefaultAuthorImage} className="author__image" alt={author.name} />;
    const description = author.description ? (
        <Paragraph ellipsis type="secondary">
            {author.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("author.noDescription")}</Text>
    );
    const bookCount = (
        <IconText icon={ImBooks} text={t("author.bookCount", { count: author.bookCount })} key="auhtor-book-count"
            href={`/libraries/${libraryId}/books?author=${author.id}`} />
    );
    const writingsCount = (
        <IconText icon={FaPenFancy} text={t("author.writingCount", { count: 0 })} key="author-writings-count"
            href={`/libraries/${libraryId}/articles?author=${author.id}`} />
    );

    const editLink = (
        <IconText icon={FaEdit} text={t("actions.edit")} key="author-edit"
            href={`/libraries/${libraryId}/authors/${author.id}/edit`} />
    );

    const deleteAuthor = (<AuthorDeleteButton libraryId={libraryId} author={author} t={t} type="ghost" size="small" />)

    return (
        <Card key={author.id} cover={cover} hoverable actions={[editLink, deleteAuthor, bookCount, writingsCount]}
            onClick={() => navigate(`/libraries/${libraryId}/authors/${author.id}`)}>
            <Card.Meta title={author.name} description={description} />
        </Card>
    );
}

export default AuthorCard;
