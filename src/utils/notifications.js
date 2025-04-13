import { notifications } from '@mantine/notifications';

// Local Import
// import { IconError, IconSuccess, IconWarning, IconInfo } from '@/components/icons';

//----------------------------------------
export function error({ title, message, allowClose = true }) {
    notifications.show({
        color: 'red',
        title: title,
        message: message,
        withCloseButton: allowClose,
        // icon: (<IconError />),
    });
}

export function success({ title, message, allowClose = true }) {
    notifications.show({
        color: 'green',
        title: title,
        message: message,
        withCloseButton: allowClose,
        // icon: <IconSuccess />,
    });
}

export function warning({ title, message, allowClose = true }) {
    notifications.show({
        color: 'yellow',
        title: title,
        message: message,
        withCloseButton: allowClose,
        // icon: (<IconWarning />),
    });
}

export function info({ title, message, allowClose = true }) {
    notifications.show({
        color: 'blue',
        title: title,
        message: message,
        withCloseButton: allowClose,
        // icon: (<IconInfo />),
    });
}