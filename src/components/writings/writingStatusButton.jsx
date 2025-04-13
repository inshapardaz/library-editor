import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateArticlesMutation } from "@/store/slices/articles.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const WritingStatusButton = ({ articles = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const [updateArticles, { isLoading: isUpdating }] = useUpdateArticlesMutation();
    const count = articles ? articles.length : 0;

    const statusField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("writing.status.required"))
    });

    const onOk = async () => {
        await statusField.validate();
        let value = statusField.getValue();
        if (value && value != '') {
            return (writing) => {
                if (writing && writing.links && writing.links.update) {
                    return { ...writing, status: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('writing.actions.updateStatus.label')}
            buttonType={type}
            buttonSize={buttonSize}
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("writing.actions.updateStatus.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            items={articles}
            itemTitleFunc={article => article.title}
            mutation={updateArticles}
            successMessage={t("writing.actions.updateStatus.success", { count })}
            errorMessage={t("writing.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => statusField.reset()}
        >
            <EditingStatusSelect {...statusField.getInputProps()}
                t={t}
                label={t("writing.status.label")} />
        </BatchActionDrawer>
    </>);
};

WritingStatusButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    buttonSize: PropTypes.string,
    showIcon: PropTypes.bool,
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default WritingStatusButton;
