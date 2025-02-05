import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useAssignIssuePagesMutation } from "@/store/slices/issues.api";
import { IconAssign } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import UserSelect from '@/components/userSelect';

// ------------------------------------------------------

const IssuePageAssignButton = ({ libraryId, pages = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const user = useSelector(state => state.auth.user)
    const [assign, { isLoading: isAssigning }] = useAssignIssuePagesMutation();
    const count = pages ? pages.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("page.user.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        if (value && value != '') {
            return value === "none" ? {
                unassign: true
            } :
                {
                    accountId: value === "me" ? user.id : value,
                };
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.assign.title')}
            buttonType={type}
            buttonSize={buttonSize}
            variant="default" size="xs"
            disabled={count === 0}
            icon={showIcon && <IconAssign />}
            sliderTitle={t("page.actions.assign.title")}
            onOkFunc={onOk}
            busy={isAssigning}
            listTitle={t("page.actions.assign.message")}
            items={pages}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={assign}
            successMessage={t("page.actions.assign.success", { count })}
            errorMessage={t("page.actions.assign.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <UserSelect {...idField.getInputProps()}
                t={t}
                libraryId={libraryId}
                addMeOption
                label={t("page.user.label")} />
        </BatchActionDrawer>
    </>);
};

IssuePageAssignButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    buttonSize: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                update: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssuePageAssignButton;
