import PropTypes from 'prop-types';

// Ui Library Imports
import { ActionIcon, Button, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';

// Local imports
import IconText from '@/components/iconText';
import { IconDelete } from '@/components/icons';
import { error, success } from '@/utils/notifications';
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
                        success({ message: successMessage })
                    })
                    .catch((e) => {
                        console.error(e)
                        error({ message: errorMessage })
                    });
            },
        });

    if (type == "icon") {
        return (
            <IconText
                tooltip={tooltip}
                onClick={openDeleteModal}
                icon={icon || <IconDelete height={16} style={{ color: theme.colors.dark[2] }} />} />)
    } else if (type == "actionIcon") {
        return (
            <Tooltip label={tooltip}>
                <ActionIcon {...props}
                    onClick={openDeleteModal}>
                    {icon || <IconDelete height={16} style={{ color: theme.colors.dark[2] }} />}
                </ActionIcon>
            </Tooltip>)
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
