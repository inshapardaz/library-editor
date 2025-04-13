import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateIssueArticlesMutation } from "@/store/slices/issueArticles.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const IssueArticleStatusButton = ({ articles = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const [update, { isLoading: isUpdating }] = useUpdateIssueArticlesMutation();
    const count = articles ? articles.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("issueArticle.status.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        if (value && value != '') {
            return (article) => {
                if (article && article.links && article.links.update) {
                    return { ...article, status: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('issueArticle.actions.updateStatus.title')}
            buttonType={type}
            buttonSize={buttonSize}
            variant="default" size="xs"
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("issueArticle.actions.updateStatus.title")}
            onOkFunc={onOk}
            busy={isUpdating}
            listTitle={t("issueArticle.actions.updateStatus.message")}
            items={articles}
            itemTitleFunc={article => article.title}
            mutation={update}
            successMessage={t("issueArticle.actions.updateStatus.success", { count })}
            errorMessage={t("issueArticle.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <EditingStatusSelect {...idField.getInputProps()}
                t={t}
                label={t("issueArticle.status.label")} />
        </BatchActionDrawer>
    </>);
};

IssueArticleStatusButton.propTypes = {
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
                update: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssueArticleStatusButton;
