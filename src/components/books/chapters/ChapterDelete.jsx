// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';
// Local imports
import { useDeleteChapterMutation } from "../../../features/api/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function ChapterDelete({ libraryId, bookId, chapter, t, onDeleted = () =>  {} }) {
    const { message } = App.useApp();
    const [deleteChapter, { isLoading: isDeleting }] = useDeleteChapterMutation();

    const showConfirm = () => {
        confirm({
            title: t("chapter.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("chapter.actions.delete.message", { title : chapter.title }),
            okButtonProps: { disabled:  isDeleting },
            cancelButtonProps: { disabled:  isDeleting },
            closable: { isDeleting },
            onOk() {
                deleteChapter({ libraryId, bookId, chapterNumber: chapter.chapterNumber })
                    .unwrap()
                    .then(() => message.success(t("chapter.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("chapter.actions.delete.error")));
            }
        });
    };

    return (<Button type="text" onClick={showConfirm} icon={<FaTrash/>}></Button>);
}
