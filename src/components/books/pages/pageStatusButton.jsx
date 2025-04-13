import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateBookPagesMutation } from "@/store/slices/books.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const PageStatusButton = ({ pages = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [updatePages, { isLoading: isUpdating }] = useUpdateBookPagesMutation();
    const count = pages ? pages.length : 0;

    const statusField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("page.status.required"))
    });

    const onOk = async () => {
        await statusField.validate();
        let value = statusField.getValue();
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
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("page.actions.updateStatus.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            items={pages}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={updatePages}
            successMessage={t("page.actions.updateStatus.success", { count })}
            errorMessage={t("page.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => statusField.reset()}
        >
            <EditingStatusSelect {...statusField.getInputProps()}
                t={t}
                label={t("page.status.title")} />
        </BatchActionDrawer>
    </>);
};

PageStatusButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                update: PropTypes.string,
                delete: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default PageStatusButton;
