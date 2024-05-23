import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

// 3rd party libraries
import { App, Button, Form, Input, Space, Divider, Spin, Alert } from 'antd';
import { LockOutlined } from '/src/icons';

// Internal imports
import FullPageFormContainer from '/src/components/layout/fullPageFormContainer';
import {
    changePassword,
    getChangePasswordError,
    getChangePasswordStatus
} from '/src/store/slices/authSlice';


const ChangePassword = () => {
    const { message } = App.useApp();
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const status = useSelector(getChangePasswordStatus)
    const error = useSelector(getChangePasswordError)

    const onSubmit = ({ oldPassword, password }) => {
        dispatch(changePassword({ password, oldPassword }))
    };

    useEffect(() => {
        if (status === 'succeeded') {
            message.success(t('changePassword.success'))
            navigate('/')
        }
    }, [message, navigate, status, t])

    const errorMessage = error ? (<Alert showIcon message={t('changePassword.error')} type="error" />) : null

    return (<FullPageFormContainer title={t('changePassword.title')}>
        <Spin spinning={status === 'loading'}>
            <Form name="change-password" onFinish={onSubmit}>
                <Form.Item name="oldPassword" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('changePassword.oldPassword.required'),
                        }
                    ]}
                >
                    <Input type="password"
                        prefix={<LockOutlined className="change-form-item-icon" />}
                        placeholder={t('changePassword.oldPassword.label')}
                    />
                </Form.Item>
                <Form.Item name="password" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('changePassword.password.required'),
                        },
                        {
                            type: 'string',
                            min: 6,
                            message: t('changePassword.password.length'),
                        }
                    ]}
                >
                    <Input type="password"
                        prefix={<LockOutlined className="change-form-item-icon" />}
                        placeholder={t('changePassword.password.label')}
                    />
                </Form.Item>
                <Form.Item name="confirmPassword" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('changePassword.confirmPassword.required'),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('changePassword.confirmPassword.match')));
                            },
                        }),
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder={t('changePassword.confirmPassword.label')}
                    />
                </Form.Item>
                <Form.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" htmlType="submit" block>
                            {t('changePassword.submit')}
                        </Button>
                        {errorMessage}
                        <Divider />
                        <Button href="/" type="text" block> {t('header.home')}</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    </FullPageFormContainer>
    );
};

export default ChangePassword;
