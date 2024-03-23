// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteSeriesMutation } from "../../features/api/seriesSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function SeriesDeleteButton({ children, libraryId, series, t, type, onDeleted = () => { }, danger = false, block = false, size }) {
    const { message } = App.useApp();
    const [deleteSeries, { isLoading: isDeleting }] = useDeleteSeriesMutation();

    const showConfirm = () => {
        confirm({
            title: t("series.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("series.actions.delete.message", { name: series.name }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: { isDeleting },
            onOk() {
                deleteSeries({ libraryId, seriesId: series.id })
                    .unwrap()
                    .then(() => message.success(t("series.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("series.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
}
