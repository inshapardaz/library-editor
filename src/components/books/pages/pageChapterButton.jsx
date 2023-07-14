import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Space } from "antd";
import { FaLayerGroup } from "react-icons/fa";

// Local imports
import { useUpdateBookPageMutation } from "../../../features/api/booksSlice";
import ChapterSelect from "../chapters/chapterSelect";

// ------------------------------------------------------

export default function PageChapterButton({ libraryId, book, pages, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [updateBookPage, { isLoading: isAssigning }] =
        useUpdateBookPageMutation();
    const count = pages ? pages.length : 0;

    const onSubmit = (values) => {
        const promises = [];
        pages
            .slice(0)
            .reverse()
            .map((page) => {
                if (page && page.links && page.links.assign) {
                    const payload = { ...page, chapterId: values.id };
                    return promises.push(
                        updateBookPage({ page: payload }).unwrap()
                    );
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() =>
                message.success(t("page.actions.setChapter.success", { count }))
            )
            .catch((_) =>
                message.error(t("page.actions.setChapter.error", { count }))
            );
    };

    const onOk = () =>
        form
            .validateFields()
            .then((value) => {
                onSubmit(value);
            })
            .catch((info) => {
                console.log(info);
            });

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    let data = { chapterId: null };

    return (
        <>
            <Button
                type={type}
                onClick={onShow}
                disabled={count === 0}
                icon={<FaLayerGroup />}
            />
            <Modal
                open={open}
                title={t("page.actions.setChapter.title", { count })}
                onOk={onOk}
                onCancel={() => setOpen(false)}
                closable={false}
                okButtonProps={{ disabled: isAssigning }}
                cancelButtonProps={{ disabled: isAssigning }}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("page.actions.setChapter.message", {
                            sequenceNumber: pages
                                ? pages.map((p) => p.sequenceNumber).join(",")
                                : 0,
                        })}
                    </Space>
                    <Form.Item
                        name="id"
                        label={t("page.chapter.label")}
                        rules={[
                            {
                                required: true,
                                message: t("page.chapter.required"),
                            },
                        ]}
                    >
                        <ChapterSelect
                            libraryId={libraryId}
                            book={book}
                            t={t}
                            placeholder={t("page.chapter.placeholder")}
                            label={data.name}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
