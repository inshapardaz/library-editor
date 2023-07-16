// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";
// Local imports
import { useDeleteChapterMutation } from "../../../features/api/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function ChapterDeleteButton({ chapters = [], t, type }) {
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
            okButtonProps: { disabled: isDeleting },
            okType: "danger",
            cancelButtonProps: { disabled: isDeleting },
            closable: { isDeleting },
            onOk() {
                const promises = [];
                chapters
                    .slice(0)
                    .reverse()
                    .map((chapter) => {
                        if (chapter && chapter.links && chapter.links.delete) {
                            return promises.push(
                                deleteChapter({ chapter }).unwrap()
                            );
                        }
                        return Promise.resolve();
                    });

                Promise.all(promises)
                    .then(() =>
                        message.success(
                            t("chapter.actions.delete.success", { count })
                        )
                    )
                    .catch((_) =>
                        message.error(
                            t("chapter.actions.delete.error", { count })
                        )
                    );
            },
        });
    };

    return (
        <Button
            type={type}
            disabled={count < 1}
            onClick={showConfirm}
            icon={<FaTrash />}
        ></Button>
    );
}
