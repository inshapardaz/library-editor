import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Card, Space } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import moment from "moment";

// Local Imports
import styles from "../../../styles/common.module.scss";
import helpers from "../../../helpers";
import { IconText } from "../../common/iconText";
import { GiStack } from "react-icons/gi";
import { FaNewspaper } from "react-icons/fa";
// ------------------------------------------------------

function IssueCard({ libraryId, periodicalId, issue, t }) {
    var navigate = useNavigate();
    const cover = issue.links.image ? <img src={issue.links.image} onError={helpers.setDefaultIssueImage} className={styles["book__image"]} alt={issue.id} /> : <img src={helpers.defaultBookImage} className={styles["book__image"]} alt={`${issue.volume}-${issue.issueNumber}`} />;

    const edit = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}>
            <FiEdit />
        </Link>
    );
    const description = (<Space>
        <IconText icon={GiStack}
            text={t("issue.volumeNumber.label")}
            secondaryText={issue.volumeNumber}
            onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/`)} />
        <IconText icon={FaNewspaper}
            text={t("issue.issueNumber.label")}
            secondaryText={issue.issueNumber}
            onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`)} />
    </Space>);
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
