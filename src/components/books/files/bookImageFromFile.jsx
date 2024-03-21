import { App, Button, Modal, Progress, Tooltip } from "antd";
import { FaFileImage } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import { useUpdateBookImageMutation } from "../../../features/api/booksSlice";
import { useState } from "react";
import helpers from "../../../helpers";

// ------------------------------------------------------
export const BookImageFromFile = ({ libraryId, book, content, t, disabled }) => {
    const { message } = App.useApp();
    const [progress, setProgress] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [updateBookImage, { isLoading: isUpdatingImage }] = useUpdateBookImageMutation();

    const onProgressDownload = ({ loaded, total }) => {
        if (total > 0) {
            setProgress((loaded / total) * 100);
        }
    };

    const setFirstPageAsImage = async () => {
        setConfirm(true);
        setOpen(true);
        setProgress(0);
        try {
            const file = await helpers.downloadFile(content.links.download, onProgressDownload);
            const pdf = await (pdfjsLib.getDocument({ data: file }).promise);
            let img = await helpers.loadPdfPage(pdf, 1);
            await updateBookImage({ libraryId, bookId: book.id, payload: helpers.dataURItoBlob(img) }).unwrap();
            message.success(t("book.actions.setFirstPageAsImage.success"));
        }
        catch (e) {
            console.error(e);
            message.error(t("book.actions.setFirstPageAsImage.error"));
        }
        finally {
            setConfirm(false);
            setOpen(false);
            setProgress(0);
        }
    };
    return book && book.links.image_upload && (<>
        <Tooltip title={t('book.actions.setFirstPageAsImage.title')}>
            <Button icon={<FaFileImage />} disabled={isUpdatingImage || disabled} onClick={() => setOpen(true)} />
        </Tooltip>
        <Modal
            title={t('book.actions.setFirstPageAsImage.title')}
            open={open}
            onOk={() => setFirstPageAsImage()}
            confirmLoading={confirm}
            maskClosable={false}
            onCancel={() => setOpen(false)}
        >
            {(confirm) ?
                (<Progress showInfo={false} percent={progress} />)
                : t('book.actions.setFirstPageAsImage.message')}
        </Modal>
    </>
    );
};
