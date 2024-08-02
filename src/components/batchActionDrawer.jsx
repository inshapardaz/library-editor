import React, { useCallback, useState } from "react";
import { useEffect } from "react";

// 3rd party imports
const { App, Drawer, Tooltip, Button, Space, List, Avatar } = require("antd")

// Local imports
import { FaFileUpload, FaHourglass, FaRegCheckCircle, FaRegTimesCircle, LoadingOutlined } from '/src/icons';
import { ProcessStatus } from "/src/models";

// -------------------------------------------
const getIcon = (request) => {
    switch (request.status) {
        case ProcessStatus.Pending:
            return <FaHourglass />;
        case ProcessStatus.InProcess:
            return <LoadingOutlined />;
        case ProcessStatus.CreatingBook:
        case ProcessStatus.UploadingContents:
            return <FaFileUpload />
        case ProcessStatus.Completed:
            return <FaRegCheckCircle />;
        case ProcessStatus.Failed:
            return <FaRegTimesCircle style={{ color: 'red' }} />;
        default:
            return null;
    }
}
// -------------------------------------------

const RequestList = ({ title, requests, itemTitle, itemDescription }) => {
    return (<>
        {title}
        <List dataSource={requests}
            renderItem={request => (
                <List.Item key={request.id}>
                    <List.Item.Meta
                        avatar={<Avatar size={32} icon={getIcon(request)} />}
                        title={itemTitle ? itemTitle(request.data) : request.id}
                        description={itemDescription && itemDescription(request.data)} />
                </List.Item>)} />
    </>);
}
// -------------------------------------------

const BatchActionDrawer = ({
    title,
    icon,
    tooltip,
    buttonType,
    disabled,
    sliderTitle,
    placement = 'left',
    size = 'default',
    // Called when ok button pressed. If returns false or null, it will do nothing.
    // Return payload for requests and it will call mutation with it
    // if payload is a function, this function will be called for each call to api and response from this function
    // will be sent as payload. Request data would be passed to the function
    // Do any validation on this callback if needed
    onOk = () => { },
    onShow = () => { },
    onClose = () => { },
    errorMessage,
    successMessage,
    closable,
    listTitle,
    items,
    itemTitle,
    itemDescription,
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
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([]);

    const onShowDrawer = () => {
        setOpen(true);
        onShow();
    }
    const onCloseDrawer = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const onProgress = useCallback((request) => {
        let newRequests = [...requests];
        let index = newRequests.findIndex(x => x.id === request.id);
        if (index === -1) return;
        if (request.status) {
            newRequests[index].status = request.status;
        }

        setRequests(newRequests);
    }, [requests]);

    const onSubmit = useCallback(async (e) => {
        try {
            var payload = await onOk();

            if (!payload) return;

            if (mutation) {
                await mutation({ requests, payload, onProgress })
            }

            const hasFailure = requests.find(x => x.status == ProcessStatus.Failed);

            if (hasFailure) {
                if (errorMessage) {
                    message.error(errorMessage);
                }
            } else {
                if (successMessage) {
                    message.success(successMessage);
                }

                onCloseDrawer();
            }
        }
        catch (e) {
            console.error(e);
            if (errorMessage) {
                message.error(errorMessage);
            }
        }
    });

    useEffect(() => {
        if (open) return;

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
            <Tooltip title={tooltip}>
                <Button
                    type={buttonType}
                    onClick={onShowDrawer}
                    disabled={disabled}
                    icon={icon}
                >
                    {title}
                </Button>
            </Tooltip>
            <Drawer
                title={sliderTitle}
                placement={placement}
                onClose={onCloseDrawer}
                open={open}
                size={size}
                closable={closable}
                maskClosable={closable}
                extra={<Space>
                    <Button
                        onClick={onCloseDrawer}
                        disabled={!closable}>
                        {t('actions.cancel')}
                    </Button>
                    <Button type="primary" onClick={onSubmit} disabled={!closable}>
                        {t('actions.ok')}
                    </Button>
                </Space>}>
                <Space.Compact direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    {children}
                    <RequestList
                        title={listTitle}
                        requests={requests}
                        itemTitle={itemTitle}
                        itemDescription={itemDescription} />
                </Space.Compact>
            </Drawer>
        </>);
};


export default BatchActionDrawer;
