import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useAssignChaptersMutation } from "@/store/slices/books.api";
import { IconAssign } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import UserSelect from '@/components/userSelect';

// ------------------------------------------------------

const ChapterAssignButton = ({ libraryId, chapters = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [assignChapters, { isLoading: isAssigning }] = useAssignChaptersMutation();
    const count = chapters ? chapters.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("chapter.user.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        if (value && value != '') {
            return value === "none" ? {
                unassign: true
            } :
                {
                    accountId: value === "me" ? null : value,
                };
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('chapter.actions.assign.label')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconAssign />}
            sliderTitle={t("chapter.actions.assign.title", { count })}
            onOkFunc={onOk}
            busy={isAssigning}
            listTitle={t("chapter.actions.assign.message")}
            items={chapters}
            itemTitleFunc={chapter => chapter.title}
            mutation={assignChapters}
            successMessage={t("chapter.actions.assign.success", { count })}
            errorMessage={t("chapter.actions.assign.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <UserSelect {...idField.getInputProps()}
                t={t}
                libraryId={libraryId}
                addMeOption
                label={t("chapter.user.label")} />
        </BatchActionDrawer>
    </>);
};

ChapterAssignButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    chapters: PropTypes.arrayOf(
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

export default ChapterAssignButton;
