import React, { useState } from "react";

// 3rd Party Imports
import { App, Button, Modal, Progress, Tooltip } from "antd";

// Local Imports
import { FaFileImage } from "/src/icons";
import { useUpdateIssueImageMutation } from "/src/store/slices/issuesSlice";
import { downloadFile, loadPdfPage, dataURItoBlob } from "/src/util";
import { pdfjsLib } from '/src/util/pdf'
// ------------------------------------------------------

const IssueImageFromFile = ({ libraryId, issue, content, t, disabled }) => {
    const { message } = App.useApp();
    const [progress, setProgress] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [updateIssueImage, { isLoading: isUpdatingImage }] = useUpdateIssueImageMutation();

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
            const file = await downloadFile(content.links.download, onProgressDownload);
            const pdf = await (pdfjsLib.getDocument({ data: file }).promise);
            let img = await loadPdfPage(pdf, 1);
            await updateIssueImage({ issue: issue, payload: dataURItoBlob(img) }).unwrap();
            message.success(t("issue.actions.setFirstPageAsImage.success"));
        }
        catch (e) {
            console.error(e);
            message.error(t("issue.actions.setFirstPageAsImage.error"));
        }
        finally {
            setConfirm(false);
            setOpen(false);
            setProgress(0);
        }
    };
    return issue && issue.links.image_upload && (<>
        <Tooltip title={t('issue.actions.setFirstPageAsImage.title')}>
            <Button icon={<FaFileImage />} disabled={isUpdatingImage || disabled} onClick={() => setOpen(true)} />
        </Tooltip>
        <Modal
            title={t('issue.actions.setFirstPageAsImage.title')}
            open={open}
            onOk={() => setFirstPageAsImage()}
            confirmLoading={confirm}
            maskClosable={false}
            onCancel={() => setOpen(false)}
        >
            {(confirm) ?
                (<Progress showInfo={false} percent={progress} />)
                : t('issue.actions.setFirstPageAsImage.message')}
        </Modal>
    </>
    );
};

export default IssueImageFromFile;
