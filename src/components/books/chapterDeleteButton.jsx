import PropTypes from 'prop-types';

// UI Library Imprort

// Local imports
import { useDeleteChaptersMutation } from "@/store/slices/books.api";
import { IconDelete } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';

// ------------------------------------------------------

const ChapterDeleteButton = ({ chapters = [], t, type, showIcon = true, onDeleted = () => { } }) => {
    const [deleteChapters, { isLoading: isDeleting }] =
        useDeleteChaptersMutation();
    const count = chapters ? chapters.length : 0;
    const onOk = async () => true;
    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('chapter.actions.delete.title')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconDelete />}
            sliderTitle={t("chapter.actions.delete.title")}
            onOkFunc={onOk}
            busy={isDeleting}
            listTitle={t("chapter.actions.delete.message")}
            items={[...chapters].sort((a, b) => b.chapterNumber > a.chapterNumber)}
            itemTitleFunc={chapter => chapter.title}
            mutation={deleteChapters}
            successMessage={t("chapter.actions.delete.success", { count })}
            errorMessage={t("chapter.actions.delete.error", { count })}
            onSuccess={onDeleted}
        >

        </BatchActionDrawer >
    </>);
};

ChapterDeleteButton.propTypes = {
    t: PropTypes.any,
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
    onDeleted: PropTypes.func
};

export default ChapterDeleteButton;
