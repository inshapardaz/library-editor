import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

// 3rd Party Libraries
import { Button, Divider, List, Space } from "antd";

// Local Import
import "./styles.scss";
import { FiEdit, FiTrash, GiStack, FaNewspaper } from "/src/icons";
import { bookPlaceholderImage, setDefaultIssueImage, getDateFormatFromFrequency } from "/src/util";
import IconText from "/src/components/common/iconText";
// ------------------------------------------------------

const IssueListItem = ({ libraryId, periodicalId, issue, t }) => {
    const navigate = useNavigate();
    const cover = issue.links.image ? <img src={issue.links.image} onError={setDefaultIssueImage} className="issue__image--small" alt={issue.id} /> : <img src={bookPlaceholderImage} className="issue__image--small" alt={`${issue.volume}-${issue.issueNumber}`} />;
    const title = <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>{moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency))}</Link>;
    const edit = (<Button type="text" size="small"
        onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`)}
        icon={<FiEdit />} />);
    const deleteAction = <FiTrash />;
    const description = (<Space>
        <IconText icon={GiStack}
            text={t("issue.volumeNumber.label")}
            secondaryText={issue.volumeNumber}
            href={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/`} />
        <Divider orientation="vertical" />
        <IconText icon={FaNewspaper}
            text={t("issue.issueNumber.label")}
            secondaryText={issue.issueNumber}
            href={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`} />
    </Space>);
    return (
        <List.Item key={issue.id} actions={[
            edit,
            deleteAction]} extra={cover}>
            <List.Item.Meta title={title} description={description} />
        </List.Item>
    );
};

export default IssueListItem;
