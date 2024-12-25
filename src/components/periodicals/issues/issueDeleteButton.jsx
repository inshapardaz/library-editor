import PropTypes from 'prop-types';
import moment from "moment";

// Local imports
import { getDateFormatFromFrequency } from '@/utils';
import { useDeleteIssueMutation } from '@/store/slices/issues.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const IssueDeleteButton = ({ libraryId, issue, frequency, t, onDeleted }) => {

    const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(frequency));

    return (<DeleteButton
        title={t("issue.actions.delete.title")}
        message={t("issue.actions.delete.message", { name: title })}
        tooltip={t('issue.actions.delete.label', { name: title })}
        successMessage={t("issue.actions.delete.success", { name: title })}
        errorMessage={t("issue.actions.delete.error", { name: title })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteIssue({ libraryId, issue }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

IssueDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    frequency: PropTypes.string,
    issue: PropTypes.shape({
        id: PropTypes.number,
        issueNumber: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueDate: PropTypes.string,
        periodicalId: PropTypes.number,
        periodicalName: PropTypes.string,
        pageCount: PropTypes.number,
        articleCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        })
    })
};

export default IssueDeleteButton;