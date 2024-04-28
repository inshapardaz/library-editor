// Third party libraries
import { App, Button, Modal, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";

// Local imports
import { useDeleteBookContentMutation } from "~/src/store/slices/booksSlice";

// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const FileDeleteButton = ({ content, t, type }) => {
    const { message } = App.useApp();
    const [deleteBookContent, { isLoading: isDeleting }] = useDeleteBookContentMutation();

    const showConfirm = () => {
        confirm({
            title: t("book.actions.deleteFile.title"),
            icon: <ExclamationCircleFilled />,
            content: t("book.actions.deleteFile.message", {
                title: content.fileName,
            }),
            okButtonProps: { loading: isDeleting },
            okType: "danger",
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                if (content && content.links && content.links.delete) {
                    return deleteBookContent({ content }).unwrap()
                        .then(() => {
                            message.success(t("chapter.actions.delete.success"))
                        })
                        .catch(() => {
                            message.error(t("chapter.actions.delete.error"))
                        });
                }
            }
        });
    };

    return (
        <Tooltip title={t('actions.delete')}>
            <Button
                type={type}
                onClick={showConfirm}
                icon={<FaTrash />}
            />
        </Tooltip>
    );
};

export default FileDeleteButton;
