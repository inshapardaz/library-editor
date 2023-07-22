import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

// Third party libraries
import {
    App,
    Button,
    Modal,
    Form,
    Switch,
    List,
    Input,
    Space,
    Avatar,
} from "antd";
import { MdImageSearch } from "react-icons/md";
import {
    FaRegCheckCircle,
    FaRegHourglass,
    FaRegTimesCircle,
    FaTrashAlt,
} from "react-icons/fa";

// Local imports
import { useOcrBookPageMutation } from "../../../features/api/booksSlice";

// ------------------------------------------------------

const ProcessingStatus = {
    Pending: "pending",
    Complete: "complete",
    Failed: "failed",
};

const ProcessingIcon = ({ status }) => {
    switch (status) {
        case ProcessingStatus.Pending:
            return <FaRegHourglass />;
        case ProcessingStatus.Complete:
            return <FaRegCheckCircle />;
        case ProcessingStatus.Failed:
            return <FaRegTimesCircle />;
        default:
            return null;
    }
};

// ------------------------------------------------------

export default function PageOcrButton({ pages, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [key, setKey] = useLocalStorage("ocr.key");
    const [pagesStatus, setPagesStatus] = useState([]);
    const data = { key, storeApiKey: false };
    const [ocrBookPage, { isLoading: isBusy }] = useOcrBookPageMutation();
    const count = pages ? pages.length : 0;

    useEffect(() => {
        if (pages) {
            setPagesStatus(
                pages.map((p) => ({
                    ...p,
                    status: ProcessingStatus.Pending,
                }))
            );
        }
    }, [pages]);

    const onSubmit = (values) => {
        const promises = pagesStatus
            .slice(0)
            .reverse()
            .map((page) => {
                if (page && page.links && page.links.ocr) {
                    return ocrBookPage({ page, key: values.key }).unwrap();
                }
                return Promise.resolve();
            });

        return Promise.all(promises)
            .then(() => {
                if (values.storeApiKey) {
                    setKey(values.key);
                }
            })
            .then(() =>
                message.success(t("page.actions.setChapter.success", { count }))
            )
            .catch((_) => {
                message.error(t("page.actions.setChapter.error", { count }));
            });
    };

    const onOk = () => {
        form.validateFields()
            .then(onSubmit)
            .catch((info) => console.log(info));
    };

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const onDelete = (page) => {
        const newList = pagesStatus.filter(
            (p) => page.sequenceNumber !== p.sequenceNumber
        );

        setPagesStatus(newList);
    };
    return (
        <>
            <Button
                type={type}
                onClick={onShow}
                disabled={count === 0}
                icon={<MdImageSearch />}
            />
            <Modal
                title={t("page.actions.ocr.title", { count })}
                open={open}
                onOk={onOk}
                confirmLoading={isBusy}
                onCancel={() => setOpen(false)}
                closable={!isBusy}
                maskClosable={!isBusy}
                cancelButtonProps={{ disabled: isBusy }}
                width={1000}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("page.actions.ocr.message", {
                            sequenceNumber: pagesStatus
                                ? pagesStatus
                                      .map((p) => p && p.sequenceNumber)
                                      .join(",")
                                : 0,
                        })}
                    </Space>
                    <Form.Item
                        label={t("page.actions.ocr.key.label")}
                        name="key"
                        help={t("page.actions.ocr.key.description")}
                        rules={[
                            {
                                required: true,
                                message: t("page.actions.ocr.key.required"),
                            },
                        ]}
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                        label={t("page.actions.ocr.saveKey.label")}
                        name="storeApiKey"
                        help={t("page.actions.ocr.saveKey.description")}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <List
                            bordered
                            dataSource={pagesStatus}
                            renderItem={(p) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            disabled={isBusy}
                                            icon={<FaTrashAlt />}
                                            onClick={() => onDelete(p)}
                                        />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar>
                                                <ProcessingIcon
                                                    status={p.status}
                                                />
                                            </Avatar>
                                        }
                                        title={p.sequenceNumber}
                                    />
                                </List.Item>
                            )}
                        ></List>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
