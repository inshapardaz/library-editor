import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateArticlesMutation } from "@/store/slices/articles.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const PoetryStatusButton = ({ articles = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const [updateArticles, { isLoading: isUpdating }] = useUpdateArticlesMutation();
    const count = articles ? articles.length : 0;

    const statusField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("poetry.status.required"))
    });

    const onOk = async () => {
        await statusField.validate();
        let value = statusField.getValue();
        if (value && value != '') {
            return (poetry) => {
                if (poetry && poetry.links && poetry.links.update) {
                    return { ...poetry, status: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('poetry.actions.updateStatus.label')}
            buttonType={type}
            buttonSize={buttonSize}
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("poetry.actions.updateStatus.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            items={articles}
            itemTitleFunc={article => article.title}
            mutation={updateArticles}
            successMessage={t("poetry.actions.updateStatus.success", { count })}
            errorMessage={t("poetry.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => statusField.reset()}
        >
            <EditingStatusSelect {...statusField.getInputProps()}
                t={t}
                label={t("poetry.status.label")} />
        </BatchActionDrawer>
    </>);
};

PoetryStatusButton.propTypes = {
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

export default PoetryStatusButton;
