import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form } from "antd";
import { MdOutlineAssignmentInd } from 'react-icons/md';

// Local imports
import { useAssignChapterMutation } from "../../../features/api/booksSlice";
import UserSelect from "../../userSelect";

// ------------------------------------------------------

export default function ChapterAssignButton({ libraryId, bookId, chapter, t, buttonType = "text" }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [assignChapter, { isLoading: isAdding }] = useAssignChapterMutation();

    const onSubmit = (values) => {
        const payload = {
            accountId : values.id,
        }
        return assignChapter({ libraryId, bookId, chapterNumber: chapter.chapterNumber, payload })
            .unwrap()
            .then(() => setOpen(false))
            .then(() => message.success(t("chapter.actions.assign.success")))
            .catch((_) => message.error(t("chapter.actions.assign.error")));
    };

    const onOk = () =>
        form.validateFields()
            .then((values) => {
                onSubmit(values)
            })
            .catch((info) => {});

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    }

    let data = {
        id: "",
        name: "",
    }

    if (chapter){
        if (chapter.reviewerAccountId) {
            data.id = chapter.reviewerAccountId;
            data.name = chapter.reviewerAccountName;
        } else if (chapter.writerAccountId) {
            data.id = chapter.writerAccountId;
            data.name = chapter.writerAccountName;
        }
    }


    return (<>
        <Button type={buttonType} onClick={onShow} icon={<MdOutlineAssignmentInd />} />
        <Modal open={open}
            title={t("chapter.actions.assign.title")}
            onOk={onOk}
            onCancel={() => setOpen(false)}
            closable={false}
            okButtonProps={{ disabled:  isAdding }}
            cancelButtonProps={{ disabled:  isAdding }}>
            <Form form={form} layout="vertical" initialValues={ data }>
                <Form.Item name="id"
                    label={t("chapter.user.label")}
                    rules={[
                        {
                            required: true,
                            message: t("chapter.user.required"),
                        },
                    ]}>
                    <UserSelect libraryId={libraryId} t={t}
                        placeholder={t("chapter.user.placeholder")}
                        label={ data.name } />
                </Form.Item>
            </Form>
        </Modal></>);
}
