import React from 'react';
import moment from "moment";

// 3rd party libraries
import { Divider, Space, Typography } from "antd";
import { GiStack } from "react-icons/gi";
import { FaNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Local imports
import "./styles.scss";
import { issuePlaceholderImage, setDefaultIssueImage, getDateFormatFromFrequency } from "/src/util";
import IconText from "/src/components/common/iconText";

//------------------------------------

const IssueInfo = ({ libraryId, periodical, issue, t }) => {
    const navigate = useNavigate();

    if (!issue) return null;

    const title = issue && moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency));

    const cover = issue.links.image ? (
        <img
            className="issue__image--thumbnail"
            src={issue.links.image}
            onError={setDefaultIssueImage}
            alt={title}
        />
    ) : (
        <img
            className="issue__image--thumbnail"
            src={issuePlaceholderImage}
            alt={title}
        />
    );
    return <>
        <Space direction="vertical" style={{ width: "100%" }}>
            {cover}
            <Typography.Title>
                {periodical?.title}
            </Typography.Title>
            <Typography.Title level={2}>
                {title}
            </Typography.Title>
            <Divider />
            <IconText icon={GiStack}
                text={t("issue.volumeNumber.label")}
                secondaryText={issue.volumeNumber}
                onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodical?.id}/volumes/${issue.volumeNumber}/`)} />
            <IconText icon={FaNewspaper}
                text={t("issue.issueNumber.label")}
                secondaryText={issue.issueNumber}
                onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodical?.id}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`)} />
        </Space>
    </>;
};

export default IssueInfo;
