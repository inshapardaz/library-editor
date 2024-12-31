import PropTypes from 'prop-types';
import { useCallback, useState } from "react";
import { useEffect } from "react";

// Ui Library imports
import { Avatar, Button, Drawer, List, ScrollArea, Stack, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';


// Local imports
import { IconUpload, IconBusy, IconDone, IconFailed, IconLoading } from '@/components/icons';
import { ProcessStatus } from "@/models";
import { useDisclosure } from '@mantine/hooks';

// -------------------------------------------
const getIcon = (request) => {
    switch (request.status) {
        case ProcessStatus.Pending:
            return <IconBusy />;
        case ProcessStatus.InProcess:
            return <IconLoading />;
        case ProcessStatus.CreatingBook:
        case ProcessStatus.UploadingContents:
            return <IconUpload />
        case ProcessStatus.Completed:
            return <IconDone />;
        case ProcessStatus.Failed:
            return <IconFailed style={{ color: 'red' }} />;
        default:
            return <IconBusy />;
    }
}
// -------------------------------------------

const RequestList = ({ requests, itemTitleFunc, itemDescriptionFunc }) => {
    return (
        <List>
            {requests.map(request => (
                <List.Item key={request.id} icon={<Avatar size={32}>{getIcon(request)}</Avatar>}>
                    {itemTitleFunc ? itemTitleFunc(request.data) : request.id}
                    {itemDescriptionFunc && itemDescriptionFunc(request.data)}
                </List.Item>))
            }
        </List >);
}

RequestList.propTypes = {
    itemTitleFunc: PropTypes.func,
    itemDescriptionFunc: PropTypes.func,
    requests: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            data: PropTypes.any,
        })),
};

// -------------------------------------------

const BatchActionDrawer = ({
    title,
    icon,
    tooltip,
    buttonType,
    disabled,
    sliderTitle,
    placement = 'right',
    size = 'sm',
    // Called when ok button pressed. If returns false or null, it will do nothing.
    // Return payload for requests and it will call mutation with it
    // if payload is a function, this function will be called for each call to api and response from this function
    // will be sent as payload. Request data would be passed to the function
    // Do any validation on this callback if needed
    onOkFunc = () => { },
    onShow = () => { },
    onClose = () => { },
    onSuccess = () => { },
    errorMessage,
    successMessage,
    busy,
    listTitle,
    items,
    itemTitleFunc,
    itemDescriptionFunc,
    // Mutation to be called. Mutation must take parameter like following:
    //  { requests, payload, onProgress }
    // - requests : this is the list of request objects to make,
    //   structure of request is { status: ProcessStatus.Pending,id: 1, data: { text : 'some text' } }
    // - payload :  this is the payload to be sent as part of request
    //   if this is a callback it will be called with the request data and must return the payload for request for that particular object else payload object is sent.
    // - onProgress : callback called for each item when its progress status for request is changed. Parameter is request object with updated status
    mutation,
    t,
    children
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [requests, setRequests] = useState([]);

    const onShowDrawer = () => {
        open(true);
        onShow();
    }
    const onCloseDrawer = useCallback(() => {
        close();
        if (onClose) {
            onClose();
        }
    }, [close, onClose]);

    const onProgress = useCallback((request) => {
        let newRequests = [...requests];
        let index = newRequests.findIndex(x => x.id === request.id);
        if (index === -1) return;
        if (request.status) {
            newRequests[index].status = request.status;
        }

        setRequests(newRequests);
    }, [requests]);

    const onSubmit = useCallback(async () => {
        try {
            var payload = await onOkFunc();

            if (!payload) {
                return;
            }

            if (mutation) {
                await mutation({ requests, payload, onProgress })
            }

            const hasFailure = requests.find(x => x.status == ProcessStatus.Failed);

            if (hasFailure) {
                if (errorMessage) {
                    notifications.show({
                        color: 'red',
                        title: errorMessage
                    });
                }
            } else {
                if (successMessage) {
                    notifications.show({
                        color: 'green',
                        title: successMessage
                    })
                }

                onCloseDrawer();
                onSuccess();
            }
        }
        catch (e) {
            console.error(e);
            if (errorMessage) {
                notifications.show({
                    color: 'red',
                    title: errorMessage
                });
            }
        }
    }, [errorMessage, mutation, onCloseDrawer, onOkFunc, onProgress, onSuccess, requests, successMessage]);

    useEffect(() => {
        if (busy) return;
        if (items) {
            let mappedRequests = items.map((item, index) => ({
                status: ProcessStatus.Pending,
                id: index,
                data: item
            }));

            setRequests(mappedRequests);
        }
    }, [open, items]);

    return (
        <>
            <Tooltip label={tooltip}>
                <Button
                    variant={buttonType}
                    onClick={onShowDrawer}
                    disabled={disabled}
                    leftSection={title ? icon : null}
                >
                    {title ? title : icon}
                </Button>
            </Tooltip>
            <Drawer
                title={sliderTitle}
                placement={placement}
                opened={opened}
                onClose={onCloseDrawer}
                size={size}
                withCloseButton={!busy}
                closeOnClickOutside={!busy}
                scrollAreaComponent={ScrollArea.Autosize}>
                <Stack style={{
                    width: '100%',
                }}
                >
                    {title}
                    {children}
                    <RequestList
                        title={listTitle}
                        requests={requests}
                        itemTitleFunc={itemTitleFunc}
                        itemDescription={itemDescriptionFunc} />
                    <Button type="primary" onClick={onSubmit} disabled={busy}>
                        {t('actions.ok')}
                    </Button>
                </Stack>
            </Drawer>
        </>);
};

BatchActionDrawer.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    tooltip: PropTypes.string,
    buttonType: PropTypes.string,
    disabled: PropTypes.bool,
    sliderTitle: PropTypes.string,
    placement: PropTypes.string,
    size: PropTypes.string,
    onOkFunc: PropTypes.func,
    onShow: PropTypes.func,
    onClose: PropTypes.func,
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
    busy: PropTypes.bool,
    listTitle: PropTypes.string,
    items: PropTypes.array,
    itemTitleFunc: PropTypes.func,
    itemDescriptionFunc: PropTypes.func,
    mutation: PropTypes.func,
    onSuccess: PropTypes.func,
    t: PropTypes.any,
    children: PropTypes.any,
};

export default BatchActionDrawer;
