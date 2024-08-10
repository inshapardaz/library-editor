import React from 'react';

// Local imports
import { FaTrash } from "/src/icons";
import { useDeleteIssuePagesMutation } from "/src/store/slices/issuesSlice";
import BatchActionDrawer from '/src/components/batchActionDrawer';

// ------------------------------------------------------
const IssuePageDeleteButton = ({
    pages = [],
    t,
    type
}) => {
    const [deleteIssuePages, { isLoading: isDeleting, showIcon = true }] =
        useDeleteIssuePagesMutation();
    const count = pages ? pages.length : 0;
    const onOk = () => (request) => request;

    return (<BatchActionDrawer t={t}
        tooltip={t('page.actions.delete.title')}
        buttonType={type}
        disabled={count === 0}
        icon={showIcon && <FaTrash />}
        sliderTitle={t("page.actions.delete.title")}
        onOk={onOk}
        closable={!isDeleting}
        listTitle={t("page.actions.delete.message")}
        items={[...pages].sort((a, b) => b.sequenceNumber > a.sequenceNumber)}
        itemTitle={page => page.sequenceNumber}
        mutation={deleteIssuePages}
        successMessage={t("page.actions.delete.success")}
        errorMessage={t("page.actions.delete.error")}
    />);
};

export default IssuePageDeleteButton;
