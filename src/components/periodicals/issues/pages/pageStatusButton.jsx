import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateIssuePagesMutation } from "@/store/slices/issues.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const IssuePageStatusButton = ({ pages = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const [update, { isLoading: isUpdating }] = useUpdateIssuePagesMutation();
    const count = pages ? pages.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("page.status.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        if (value && value != '') {
            return (page) => {
                if (page && page.links && page.links.update) {
                    return { ...page, status: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.updateStatus.title')}
            buttonType={type}
            buttonSize={buttonSize}
            variant="default" size="xs"
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("page.actions.updateStatus.title")}
            onOkFunc={onOk}
            busy={isUpdating}
            listTitle={t("page.actions.updateStatus.message")}
            items={pages}
            itemTitleFunc={page => page.title}
            mutation={update}
            successMessage={t("page.actions.updateStatus.success", { count })}
            errorMessage={t("page.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <EditingStatusSelect {...idField.getInputProps()}
                t={t}
                label={t("page.status.title")} />
        </BatchActionDrawer>
    </>);
};

IssuePageStatusButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    buttonSize: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            links: PropTypes.shape({
                update: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssuePageStatusButton;
