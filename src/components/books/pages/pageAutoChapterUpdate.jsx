import React, { useEffect, useState } from "react";

// Local imports
import { VscLayersActive } from "/src/icons";
import { useUpdateBookPagesMutation } from "/src/store/slices/booksSlice";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const PageAutoChapterUpdate = ({ pages, t, type }) => {
    const [updateBookPages, { isLoading: isUpdating }] = useUpdateBookPagesMutation();
    const count = pages ? pages.length : 0;
    const [updatedPages, setUpdatedPags] = useState([]);

    useEffect(() => {
        let newPages = [];
        let chapterId = null;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.chapterId) {
                chapterId = page.chapterId;
            } else if (chapterId) {
                const newPage = { ...page, chapterId: chapterId };
                newPages.push(newPage);
            }
        }

        setUpdatedPags(newPages);
    }, [pages]);

    const onOk = async () => (page) => page;

    return (
        <>
        <BatchActionDrawer t={t}
                tooltip={t("pages.actions.autoFillChapter.title", { count })}
                buttonType={type}
                disabled={updatedPages.length < 1}
                icon={<VscLayersActive />}
                sliderTitle={t("pages.actions.autoFillChapter.title", { count })}
                onOk={onOk}
                closable={!isUpdating}
                listTitle={t("pages.actions.autoFillChapter.message")}
                items={updatedPages}
                itemTitle={page => page.sequenceNumber}
                mutation={updateBookPages}
                successMessage={t("page.actions.setChapter.success", { count })}
                errorMessage={t("page.actions.setChapter.error", { count })}
            />
        </>
    );
};

export default PageAutoChapterUpdate;
