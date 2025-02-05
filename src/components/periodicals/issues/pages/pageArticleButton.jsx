import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateIssuePagesMutation } from "@/store/slices/issues.api";
import { IconChapters } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import IssueArticleSelect from '../articles/issueArticleSelect';

// ------------------------------------------------------

const IssuePageArticleButton = ({ libraryId, issue, pages = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [update, { isLoading: isUpdating }] = useUpdateIssuePagesMutation();
    const count = pages ? pages.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("page.article.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        return (page) => {
            if (page && page.links && page.links.update) {
                return { ...page, articleId: value };
            }
            return null;
        }
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.setArticle.label')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconChapters />}
            sliderTitle={t("page.actions.setArticle.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            listTitle={t("page.actions.setArticle.message")}
            items={pages}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={update}
            successMessage={t("page.actions.setArticle.success", { count })}
            errorMessage={t("page.actions.setArticle.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <IssueArticleSelect {...idField.getInputProps()}
                t={t}
                libraryId={libraryId}
                periodicalId={issue.periodicalId}
                volumeNumber={issue.volumeNumber}
                issueNumber={issue.issueNumber}
                label={t("page.article.label")} />
        </BatchActionDrawer>
    </>);
};

IssuePageArticleButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    issue: PropTypes.shape({
        periodicalId: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueNumber: PropTypes.number,
    }),
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssuePageArticleButton;
