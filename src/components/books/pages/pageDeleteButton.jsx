// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";

// Local imports
import { useDeleteBookPageMutation } from "../../../features/api/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function PageDeleteButton({
    pages = [],
    t,
    type,
    onDeleted = () => {},
}) {
    const { message } = App.useApp();
    const [deleteBookPage, { isLoading: isDeleting }] =
        useDeleteBookPageMutation();
    const count = pages ? pages.length : 0;

    const showConfirm = () => {
        confirm({
            title: t("page.actions.delete.title", { count }),
            icon: <ExclamationCircleFilled />,
            content: t("page.actions.delete.message", {
                sequenceNumber: pages.map((p) => p.sequenceNumber).join(","),
            }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: !isDeleting,
            onOk: () => {
                const promises = [];
                pages
                    .slice(0)
                    .reverse()
                    .map((page) => {
                        if (page && page.links && page.links.delete) {
                            return promises.push(
                                deleteBookPage({ page }).unwrap()
                            );
                        }
                        return Promise.resolve();
                    });

                Promise.all(promises)
                    .then(() =>
                        message.success(t("page.actions.delete.success"))
                    )
                    .then(() => onDeleted())
                    .catch((_) =>
                        message.error(t("page.actions.delete.error"))
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
