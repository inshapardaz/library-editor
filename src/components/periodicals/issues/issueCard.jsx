import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Card, Space, Typography } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import moment from "moment";

// Local Imports
import styles from "../../../styles/common.module.scss";
import helpers from "../../../helpers";
// ------------------------------------------------------

function IssueCard({ libraryId, periodicalId, issue, t }) {
    const cover = issue.links.image ? <img src={issue.links.image} onError={helpers.setDefaultIssueImage} className={styles["book__image"]} alt={issue.id} /> : <img src={helpers.defaultBookImage} className={styles["book__image"]} alt={`${issue.volume}-${issue.issueNumber}`} />;

    const edit = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}>
            <FiEdit />
        </Link>
    );
    const description = (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
                <Typography>{t("issue.volumeNumber.label")}</Typography>
                <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/`}>{issue.volumeNumber}</Link>
                <Typography>{t("issue.issueNumber.label")}</Typography>
                <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>{issue.issueNumber}</Link>
            </Space>
        </Space>
    );
    const title = moment(issue.issueDate).format(helpers.getDateFormatFromFrequency(issue.frequency));
    const deleteAction = <FiTrash />;
    return (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>
            <Card key={issue.id} cover={cover} hoverable actions={[edit, deleteAction]}>
                <Card.Meta title={title} description={description} />
            </Card>
        </Link>
    );
}

export default IssueCard;
