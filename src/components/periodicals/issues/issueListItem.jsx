import { Link } from "react-router-dom";
import moment from "moment";

// 3rd Party Libraries
import { List, Space, Typography } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";

// Local Import
import styles from "../../../styles/common.module.scss";
import helpers from "../../../helpers/index";
// ------------------------------------------------------
function IssueListItem({ libraryId, periodicalId, issue, t }) {
    const cover = issue.links.image ? <img src={issue.links.image} onError={helpers.setDefaultIssueImage} className={styles["issue__image--small"]} alt={issue.id} /> : <img src={helpers.defaultBookImage} className={styles["issue__image--small"]} alt={`${issue.volume}-${issue.issueNumber}`} />;
    const title = <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>{moment(issue.issueDate).format(helpers.getDateFormatFromFrequency(issue.frequency))}</Link>;
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
    const deleteAction = <FiTrash />;
    return (
        <List.Item key={issue.id} actions={[edit, deleteAction]} extra={cover}>
            <List.Item.Meta title={title} description={description} />
        </List.Item>
    );
}

export default IssueListItem;
