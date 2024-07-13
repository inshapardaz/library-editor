import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { List, Typography } from "antd";

// Local Import
import "./styles.scss";
import { SlCalender, FiLayers } from "/src/icons";
import IconText from "/src/components/common/iconText";
import { periodicalPlaceholderImage, setDefaultPeriodicalImage } from "/src/util";
import PeriodicalCategory from "./periodicalCategory";
import PeriodicalDeleteButton from "./periodicalDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const PeriodicalListItem = ({ libraryId, periodical, t }) => {
    const cover = periodical.links.image ? <img src={periodical.links.image} onError={setDefaultPeriodicalImage} className="periodical__image--small" alt={periodical.title} /> : <img src={periodicalPlaceholderImage} className={styles["periodical__image--small"]} alt={periodical.title} />;

    const title = <Link to={`/libraries/${libraryId}/periodicals/${periodical.id}`}>{periodical.title}</Link>;
    const description = periodical.description ? (
        <Paragraph type="secondary" ellipsis>
            {periodical.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("periodical.noDescription")}</Text>
    );
    const issueCount = (
        <IconText icon={FiLayers}
            href={`/libraries/${libraryId}/periodicals/${periodical.id}`}
            text={t("periodical.issueCount", { count: periodical.issueCount })}
            key="book-chapter-count" />
    );
    const frequency = <IconText icon={SlCalender} text={t(`periodical.frequency.${periodical.frequency.toLowerCase()}`, { count: periodical.frequency })} key="book-page-count" />;

    const editLink = (
        <IconText icon={FiLayers}
            text={t("actions.edit")}
            href={`/libraries/${libraryId}/periodicals/${periodical.id}/edit`}
            key="periodical-edit" />
    );
    const deletePeriodical = (<PeriodicalDeleteButton libraryId={libraryId} periodical={periodical} t={t} type="ghost" size="small" />);

    const categories = (<PeriodicalCategory key={`${periodical.id}-action-categories`} justList periodical={periodical} />);
    return (
        <List.Item key={periodical.id} extra={cover} actions={[
            editLink,
            issueCount,
            frequency,
            deletePeriodical,
            categories,
        ]}>
            <List.Item.Meta title={title} description={description} />
        </List.Item>
    );
};

export default PeriodicalListItem;
