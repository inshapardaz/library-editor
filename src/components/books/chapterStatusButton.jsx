import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateChaptersMutation } from "@/store/slices/books.api";
import { IconStatus } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import EditingStatusSelect from '@/components/editingStatusSelect';

// ------------------------------------------------------

const ChapterStatusButton = ({ chapters = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [updateChapters, { isLoading: isUpdating }] = useUpdateChaptersMutation();
    const count = chapters ? chapters.length : 0;

    const statusField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("chapter.status.required"))
    });

    const onOk = async () => {
        await statusField.validate();
        let value = statusField.getValue();
        if (value && value != '') {
            return (chapter) => {
                if (chapter && chapter.links && chapter.links.update) {
                    return { ...chapter, status: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('chapter.actions.updateStatus.label')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconStatus />}
            sliderTitle={t("chapter.actions.updateStatus.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            items={chapters}
            itemTitleFunc={chapter => chapter.title}
            mutation={updateChapters}
            successMessage={t("chapter.actions.updateStatus.success", { count })}
            errorMessage={t("chapter.actions.updateStatus.error", { count })}
            onSuccess={onCompleted}
            onClose={() => statusField.reset()}
        >
            <EditingStatusSelect {...statusField.getInputProps()}
                t={t}
                label={t("chapter.status.label")} />
        </BatchActionDrawer>
    </>);
};

ChapterStatusButton.propTypes = {
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

export default ChapterStatusButton;
