import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Card, Typography } from "antd";
import { FaEdit } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";

// Local Imports
import "./styles.scss"
import { periodicalPlaceholderImage, setDefaultPeriodicalImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import PeriodicalDeleteButton from "./periodicalDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const PeriodicalCard = ({ libraryId, periodical, t }) => {
    const cover = periodical.links.image ? <img src={periodical.links.image} onError={setDefaultPeriodicalImage} className="periodical__image" alt={periodical.title} /> : <img src={periodicalPlaceholderImage} className="periodical__image" alt={periodical.title} />;

    const description = periodical.description ? <Paragraph ellipsis>{periodical.description}</Paragraph> : <Text type="secondary">{t("book.noDescription")}</Text>;
    const issueCount = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodical.id}`}>
            <IconText icon={FiLayers} text={t("periodical.issueCount", { count: periodical.issueCount })} key="periodical-issue-count" />
        </Link>
    );
    const editLink = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodical.id}/edit`}>
            <IconText icon={FaEdit} text={t("actions.edit")} key="periodical-edit" />
        </Link>
    );
    const frequency = <IconText icon={SlCalender} text={t(`periodical.frequency.${periodical.frequency.toLowerCase()}`, { count: periodical.frequency })} key="book-page-count" />;
    const deletePeriodical = (<PeriodicalDeleteButton libraryId={libraryId} periodical={periodical} t={t} type="ghost" size="small" />);

    return (
        <Link to={`/libraries/${libraryId}/periodicals/${periodical.id}`}>
            <Card key={periodical.id} cover={cover} hoverable actions={[editLink, deletePeriodical, issueCount, frequency]}>
                <Card.Meta title={periodical.title} description={description} />
            </Card>
        </Link>
    );
};

export default PeriodicalCard;
