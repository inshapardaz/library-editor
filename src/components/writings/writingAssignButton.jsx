import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useAssignArticlesMutation } from "@/store/slices/articles.api";
import { IconAssign } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import UserSelect from '@/components/userSelect';

// ------------------------------------------------------

const WritingAssignButton = ({ libraryId, articles = [], t, type, buttonSize, showIcon = true, onCompleted = () => { } }) => {
    const user = useSelector(state => state.auth.user)
    const [assignArticles, { isLoading: isAssigning }] = useAssignArticlesMutation();
    const count = articles ? articles.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("writing.user.required"))
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
            tooltip={t('writing.actions.assign.label')}
            buttonType={type}
            buttonSize={buttonSize}
            disabled={count === 0}
            icon={showIcon && <IconAssign />}
            sliderTitle={t("writing.actions.assign.title", { count })}
            onOkFunc={onOk}
            busy={isAssigning}
            listTitle={t("writing.actions.assign.message")}
            items={articles}
            itemTitleFunc={writing => writing.title}
            mutation={assignArticles}
            successMessage={t("writing.actions.assign.success", { count })}
            errorMessage={t("writing.actions.assign.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <UserSelect {...idField.getInputProps()}
                t={t}
                libraryId={libraryId}
                addMeOption
                label={t("writing.user.label")} />
        </BatchActionDrawer>
    </>);
};

WritingAssignButton.propTypes = {
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

export default WritingAssignButton;
