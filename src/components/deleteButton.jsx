import PropTypes from 'prop-types';

// Ui Library Imports
import { Button, Text, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

// Local imports
import IconText from '@/components/iconText';
import { IconDelete } from '@/components/icons';

//---------------------------------
const DeleteButton = ({ title, message, tooltip, icon, successMessage, errorMessage, type = "icon", isDeleting, onDelete = () => { }, onDeleted = () => { }, ...props }) => {
    const theme = useMantineTheme();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: title,
            centered: true,
            children: (
                <Text size="sm">
                    {message}
                </Text>
            ),
            confirmProps: { color: 'red', loading: isDeleting },
            cancelProps: { loading: isDeleting },
            onConfirm: () => {
                return onDelete()
                    .then(() => onDeleted())
                    .then(() => {
                        notifications.show({
                            color: 'green',
                            title: successMessage
                        })
                    })
                    .catch(() => {
                        notifications.show({
                            color: 'red',
                            title: errorMessage
                        })
                    });
            },
        });

    if (type == "icon") {
        return (
            <IconText
                tooltip={tooltip}
                onClick={openDeleteModal}
                icon={icon || <IconDelete height={16} style={{ color: theme.colors.dark[2] }} />} />)
    } else {
        return (
            <Button {...props}
                onClick={openDeleteModal}
                leftSection={icon || <IconDelete height={16} />}>
                {title}
            </Button >)
    }
}

DeleteButton.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    tooltip: PropTypes.string,
    icon: PropTypes.any,
    successMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    isDeleting: PropTypes.bool,
    onDelete: PropTypes.func,
    onDeleted: PropTypes.func,
};

export default DeleteButton;