import React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import { Button, Form, Input, App, Space, Spin } from "antd";
import { FaTags } from "/src/icons";

// Local imports
import { useGetCategoryByIdQuery, useAddCategoryMutation, useUpdateCategoryMutation } from "/src/store/slices/categoriesSlice";
import ContentsContainer from "/src/components/layout/contentContainer";
import PageHeader from "/src/components/layout/pageHeader";
import Error from "/src/components/common/error";
import Loading from "/src/components/common/loader";

// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const CategoryEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, categoryId } = useParams();
    const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const { data: category, error, isFetching } = useGetCategoryByIdQuery({ libraryId, categoryId }, { skip: !libraryId || !categoryId });

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (values) => {
        if (categoryId) {
            updateCategory({ libraryId, categoryId, payload: values })
                .unwrap()
                .then(() => navigate(`/libraries/${libraryId}/categories`))
                .then(() => message.success(t("category.actions.edit.success")))
                .catch(() => message.error(t("category.actions.edit.error")));
        } else {
            addCategory({ libraryId, payload: values })
                .unwrap()
                .then(() => navigate(`/libraries/${libraryId}/categories`))
                .then(() => message.success(t("category.actions.add.success")))
                .catch(() => message.error(t("category.actions.add.error")));
        }
    };

    const title = category ? category.name : t("category.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<FaTags style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Spin spinning={isFetching || isAdding || isUpdating}>
                    <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={category}>
                        <Form.Item
                            name="name"
                            label={t("category.name.label")}
                            rules={[
                                {
                                    required: true,
                                    message: t("category.name.required"),
                                },
                            ]}
                        >
                            <Input placeholder={t("category.name.placeholder")} />
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
                                <Button type="primary" htmlType="submit" size="large" block>
                                    {t("actions.save")}
                                </Button>
                                <Button size="large" onClick={() => navigate(-1)} block>
                                    {t("actions.cancel")}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </ContentsContainer>
        </>
    );
};

export default CategoryEditPage;
