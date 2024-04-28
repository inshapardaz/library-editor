import { useState } from "react";

// Third party libraries
import { App, Button, Modal } from "antd";
import { VscLayersActive } from "react-icons/vsc";

// Local imports
import { useUpdateBookPageMutation } from "~/src/store/slices/booksSlice";

// ------------------------------------------------------

export default function PageAutoChapterUpdate({ pages, t, type }) {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [updateBookPage, { isLoading: isAssigning }] = useUpdateBookPageMutation();
    const count = pages ? pages.length : 0;

    const onOk = () => {
        let chapterId = null;
        const promises = [];

        if (pages.length > 0) {
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (page.chapterId) {
                    chapterId = page.chapterId;
                } else {
                    const payload = { ...page, chapterId: chapterId };
                    promises.push(updateBookPage({ page: payload }).unwrap());
                }
            }

            if (promises.length > 0) {
                Promise.all(promises)
                    .then(() =>
                        message.success(t("page.actions.setChapter.success", { count }))
                    )
                    .catch(() =>
                        message.error(t("page.actions.setChapter.error", { count }))
                    );
            }
        }

        setOpen(false);
    }

    const onShow = () => {
        setOpen(true);
    };

    return (
        <>
            <Button
                type={type}
                onClick={onShow}
                disabled={count === 0}
                icon={<VscLayersActive />}
            />
            <Modal
                open={open}
                title={t("pages.actions.autoFillChapter.title", { count })}
                onOk={onOk}
                onCancel={() => setOpen(false)}
                closable={false}
                okButtonProps={{ disabled: isAssigning }}
                cancelButtonProps={{ disabled: isAssigning }}
            >
                <p>
                    {t("pages.actions.autoFillChapter.message")}
                </p>
            </Modal>
        </>
    );
}
