import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Card, Space } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import { GiStack } from "react-icons/gi";
import { FaNewspaper } from "react-icons/fa";
import moment from "moment";

// Local Imports
import * as styles from "~/src/styles/common.module.scss";
import { bookPlaceholderImage, setDefaultIssueImage, getDateFormatFromFrequency } from "~/src/util";
import IconText from "~/src/components/common/iconText";
// ------------------------------------------------------

const IssueCard = ({ libraryId, periodicalId, issue }) => {
    var navigate = useNavigate();
    const cover = issue.links.image ? <img src={issue.links.image} onError={setDefaultIssueImage} className={styles["book__image"]} alt={issue.id} /> : <img src={bookPlaceholderImage} className={styles["book__image"]} alt={`${issue.volume}-${issue.issueNumber}`} />;

    const edit = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}>
            <FiEdit />
        </Link>
    );
    const description = (<Space>
        <IconText icon={GiStack}
            text={issue.volumeNumber}
            onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/`)} />
        <IconText icon={FaNewspaper}
            text={issue.issueNumber}
            onClick={() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`)} />
    </Space>);
    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency));
    const deleteAction = <FiTrash />;
    return (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>
            <Card key={issue.id} cover={cover} hoverable actions={[edit, deleteAction]}>
                <Card.Meta title={title} description={description} />
            </Card>
        </Link>
    );
};

export default IssueCard;
