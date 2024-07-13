import React from 'react';

// Third party libraries
import { FaTrash } from "/src/icons";

// Local imports
import { useDeleteChaptersMutation } from "/src/store/slices/booksSlice";
import BatchActionDrawer from '/src/components/batchActionDrawer';

// ------------------------------------------------------

const ChapterDeleteButton = ({ chapters = [], t, type, showIcon = true }) => {
    const [deleteChapters, { isLoading: isDeleting }] =
        useDeleteChaptersMutation();
    const count = chapters ? chapters.length : 0;

    const onOk = () => (request) => request;

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('chapter.actions.delete.title')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <FaTrash />}
            sliderTitle={t("chapter.actions.delete.title")}
            onOk={onOk}
            closable={!isDeleting}
            listTitle={t("chapter.actions.delete.message")}
            items={[...chapters].sort((a, b) => b.chapterNumber > a.chapterNumber)}
            itemTitle={chapter => chapter.title}
            mutation={deleteChapters}
            successMessage={t("chapter.actions.delete.success", { count })}
            errorMessage={t("chapter.actions.delete.error", { count })}
        >

        </BatchActionDrawer >
    </>);
};

export default ChapterDeleteButton;
