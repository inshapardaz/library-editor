import React from "react";
import { useLocalStorage } from "usehooks-ts";


// Third party libraries
import {
    Form,
    Switch,
    Input,
    Space,
    Collapse,
} from "antd";

// Local imports
import {
    MdImageSearch,
} from "/src/icons";
import { useOcrBookPagesMutation } from "/src/store/slices/booksSlice";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const PageOcrButton = ({ pages, t, type }) => {
    const [form] = Form.useForm();
    const [key, setKey] = useLocalStorage("ocr.key");

    const data = { key, storeApiKey: key != null };
    const [ocrBookPages, { isLoading: isBusy }] = useOcrBookPagesMutation();
    const count = pages ? pages.length : 0;


    const onOk = async () => {
        try {
            let values = await form.validateFields();
            setKey(values.key);
            return (page) => {
                if (page && page.links && page.links.ocr) {
                    return { key: values.key };
                }
                return null;
            }
        }
        catch {
            return false;
        }
    };

    const onShow = () => form.resetFields();

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t("page.actions.updateStatus.title")}
                buttonType={type}
                size='large'
                disabled={count === 0}
                icon={<MdImageSearch />}
                sliderTitle={t("page.actions.updateStatus.title")}
                onOk={onOk}
                closable={!isBusy}
                onShow={onShow}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={ocrBookPages}
                successMessage={t("page.actions.setChapter.success", { count })}
                errorMessage={t("page.actions.setChapter.error", { count })}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("page.actions.ocr.message")}
                    </Space>
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: t("page.actions.ocr.key.label"),
                                children: (<>
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
                                </>)
                            },
                        ]}
                    />
                </Form>
            </BatchActionDrawer>
        </>
    );
};

export default PageOcrButton;
