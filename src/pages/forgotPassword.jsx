import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

// 3rd party libraries
import { App, Button, Form, Input, Space, Divider, Spin, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Internal imports
import FullPageFormContainer from '/src/components/layout/fullPageFormContainer';
import {
    forgetPassword,
    getForgetPasswordError,
    getForgetPasswordStatus
} from '/src/store/slices/authSlice';


const ForgotPassword = () => {
    const { message } = App.useApp();
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const status = useSelector(getForgetPasswordStatus)
    const error = useSelector(getForgetPasswordError)

    const onSubmit = ({ email }) => {
        dispatch(forgetPassword({ email }))
            .then(() => {
                message.success(t('forgotPassword.success'))
                navigate('/account/login')
            })
    };

    const errorMessage = error ? (<Alert showIcon message={t('forgotPassword.error')} type="error" />) : null

    return (
        <FullPageFormContainer title={t('forgotPassword.title')}>
            <Spin spinning={status === 'loading'}>
                <Form name="forgot-password" onFinish={onSubmit}
                >
                    <Form.Item name="email"
                        rules={[
                            {
                                required: true,
                                message: t('forgotPassword.email.required'),
                            },
                            {
                                type: 'email',
                                message: t('forgotPassword.email.error'),
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('forgotPassword.email.title')} />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button type="primary" htmlType="submit" block>
                                {t('forgotPassword.submit')}
                            </Button>
                            {errorMessage}
                            <Divider />
                            <Button type="text" block href="/account/login">
                                {t('login.title')}
                            </Button>
                            <Button href="/account/register" type="text" block>{t('register.title')}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </FullPageFormContainer>
    );
};

export default ForgotPassword;
