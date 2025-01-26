import PropTypes from 'prop-types';
import { useCallback, useState } from "react";
import { useEffect } from "react";

// Ui Library imports
import { Avatar, Button, Divider, Drawer, List, ScrollArea, Stack, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Local imports
import { ProcessStatus } from "@/models";
import ProcessStatusIcon from '@/components/processStatusIcon';
import { error, success } from '@/utils/notifications';
// -------------------------------------------

const getIconColor = (status) => {
    switch (status) {
        case ProcessStatus.Pending:
            return 'gray';
        case ProcessStatus.InProcess:
            return 'blue';
        case ProcessStatus.CreatingBook:
        case ProcessStatus.UploadingContents:
            return 'blue'
        case ProcessStatus.Completed:
            return 'green';
        case ProcessStatus.Failed:
            return 'red';
        default:
            return 'gray';
    }
}
const RequestList = ({ requests, itemTitleFunc, itemDescriptionFunc }) => {
    return (
        <List>
            {requests.map(request => (
                <List.Item mb="xs" h={42} key={request.id} icon={
                    <Avatar size={32}>
                        <ProcessStatusIcon status={request.status} style={{ color: getIconColor(request.status) }} />
                    </Avatar>}>
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
    buttonSize,
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
                    error({ message: errorMessage });
                }
            } else {
                if (successMessage) {
                    success({ message: successMessage })
                }

                onCloseDrawer();
                onSuccess();
            }
        }
        catch (e) {
            console.error(e);
            if (errorMessage) {
                error({ message: errorMessage });
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
    }, [open, items, busy]);

    return (
        <>
            <Tooltip label={tooltip}>
                <Button
                    variant={buttonType}
                    size={buttonSize}
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
                    <Button type="primary" onClick={onSubmit} disabled={busy}>
                        {t('actions.ok')}
                    </Button>
                    <Divider />
                    <RequestList
                        title={listTitle}
                        requests={requests}
                        itemTitleFunc={itemTitleFunc}
                        itemDescription={itemDescriptionFunc} />
                </Stack>
            </Drawer>
        </>);
};

BatchActionDrawer.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    tooltip: PropTypes.string,
    buttonType: PropTypes.string,
    buttonSize: PropTypes.string,
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
