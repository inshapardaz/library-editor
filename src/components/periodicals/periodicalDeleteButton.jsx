// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeletePeriodicalMutation } from "../../features/api/periodicalsSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function PeriodicalDeleteButton({ children, libraryId, periodical, t, type,  onDeleted = () => {}, danger = false, block = false, size= "middle" }) {
    const { message } = App.useApp();
    const [deletePeriodical, { isLoading: isDeleting }] = useDeletePeriodicalMutation();

    const showConfirm = () => {
        confirm({
            title: t("periodical.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("periodical.actions.delete.message", { name : periodical.name }),
            okButtonProps: { disabled:  isDeleting },
            cancelButtonProps: { disabled:  isDeleting },
            closable: { isDeleting },
            onOk() {
                deletePeriodical({ libraryId, periodicalId: periodical.id })
                    .unwrap()
                    .then(() => message.success(t("periodical.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("periodical.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash/>}>{children}</Button>);
}
