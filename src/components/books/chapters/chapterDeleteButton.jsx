// Third party libraries
import { App, Button, Modal, Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";

// Local imports
import { useDeleteChapterMutation } from "~/src/store/slices/booksSlice";
// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const ChapterDeleteButton = ({ chapters = [], t, type }) => {
    const { message } = App.useApp();
    const [deleteChapter, { isLoading: isDeleting }] =
        useDeleteChapterMutation();
    const count = chapters ? chapters.length : 0;

    const showConfirm = () => {
        confirm({
            title: t("chapter.actions.delete.title", { count }),
            icon: <ExclamationCircleFilled />,
            content: t("chapter.actions.delete.message", {
                titles: chapters.map((p) => p.title).join(","),
            }),
            okButtonProps: { loading: isDeleting },
            okType: "danger",
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                const promises = chapters
                    .map((chapter) => {
                        if (chapter && chapter.links && chapter.links.delete) {
                            return deleteChapter({ chapter }).unwrap();
                        }
                        return Promise.resolve();
                    });

                return Promise.all(promises)
                    .then(() => { message.success(t("chapter.actions.delete.success", { count })) })
                    .catch(() =>
                        message.error(
                            t("chapter.actions.delete.error", { count })
                        )
                    );
            },
        });
    };

    return (
        <Tooltip title={t('actions.delete')}>
            <Button
                type={type}
                disabled={count < 1}
                onClick={showConfirm}
                icon={<FaTrash />}
            />
        </Tooltip>
    );
};

export default ChapterDeleteButton;
