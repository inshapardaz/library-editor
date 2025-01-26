import PropTypes from 'prop-types';

// UI Library Imprort
import { useField } from '@mantine/form';

// Local imports
import { useUpdateBookPagesMutation } from "@/store/slices/books.api";
import { IconChapters } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';
import ChapterSelect from '@/components/books/chapters/chapterSelect';

// ------------------------------------------------------

const PageChapterButton = ({ libraryId, bookId, pages = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [updateBookPages, { isLoading: isUpdating }] = useUpdateBookPagesMutation();
    const count = pages ? pages.length : 0;

    const idField = useField({
        initialValue: '',
        validate: (value) => (value && value != '' ? null : t("page.chapter.required"))
    });

    const onOk = async () => {
        await idField.validate();
        let value = idField.getValue();
        return (page) => {
            if (page && page.links && page.links.update) {
                return { ...page, chapterId: value };
            }
            return null;
        }
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.setChapter.label')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconChapters />}
            sliderTitle={t("page.actions.setChapter.title", { count })}
            onOkFunc={onOk}
            busy={isUpdating}
            listTitle={t("page.actions.setChapter.message")}
            items={pages}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={updateBookPages}
            successMessage={t("page.actions.setChapter.success", { count })}
            errorMessage={t("page.actions.setChapter.error", { count })}
            onSuccess={onCompleted}
            onClose={() => idField.reset()}
        >
            <ChapterSelect {...idField.getInputProps()}
                t={t}
                libraryId={libraryId}
                bookId={bookId}
                label={t("page.chapter.label")} />
        </BatchActionDrawer>
    </>);
};

PageChapterButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.any,
    bookId: PropTypes.any,
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
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

export default PageChapterButton;
