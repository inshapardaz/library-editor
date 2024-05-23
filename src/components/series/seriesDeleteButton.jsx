import React from 'react';
import { useNavigate } from "react-router-dom";

// Third party libraries
import { App, Button, Modal } from "antd";

// Local imports
import { FaTrash, ExclamationCircleFilled } from '/src/icons';
import { useDeleteSeriesMutation } from "/src/store/slices/seriesSlice";
// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const SeriesDeleteButton = ({ children, libraryId, series, t, type, onDeleted = () => { }, danger = false, block = false, size }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [deleteSeries, { isLoading: isDeleting }] = useDeleteSeriesMutation();

    const showConfirm = () => {
        confirm({
            title: t("series.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("series.actions.delete.message", { name: series.name }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteSeries({ libraryId, seriesId: series.id })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => navigate(`/libraries/${libraryId}/series`))
                    .then(() => { message.success(t("series.actions.delete.success")) })
                    .catch(() => { message.error(t("series.actions.delete.error")) });
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default SeriesDeleteButton;
