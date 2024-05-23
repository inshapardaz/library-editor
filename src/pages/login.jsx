import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

// 3rd party libraries
import { Alert, Button, Form, Input, Space, Spin, Divider } from 'antd';
import { LockOutlined, UserOutlined } from '/src/icons';

// Internal imports
import { login, reset, getLoginStatus, getLoginError, isLoggedIn } from '/src/store/slices/authSlice'
import FullPageFormContainer from '/src/components/layout/fullPageFormContainer';

// ---------------------------------------------------------------

const Login = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const isUserLoggedIn = useSelector(isLoggedIn)
    const status = useSelector(getLoginStatus)
    const error = useSelector(getLoginError)
    const navigate = useNavigate();

    useEffect(() => {
        if (isUserLoggedIn) {
            navigate('/')
        }
        else {
            dispatch(reset())
        }

    }, [dispatch, isUserLoggedIn, navigate])

    const onSubmit = ({ email, password }) => {
        dispatch(login({ email, password }))
    };

    const errorMessage = error ? (<Alert showIcon message={t('login.error')} type="error" />) : null

    return (
        <FullPageFormContainer title={t('login.title')}>
            <Spin spinning={status === 'loading'}>
                <Form name="login" onFinish={onSubmit} >
                    <Form.Item name="email"
                        rules={[
                            {
                                required: true,
                                message: t('login.email.required'),
                            },
                            {
                                type: 'email',
                                message: t('login.email.error'),
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('login.email.title')} />
                    </Form.Item>
                    <Form.Item name="password"
                        rules={[
                            {
                                required: true,
                                message: t('login.password.required'),
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder={t('login.password.title')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button type="primary" htmlType="submit" block>
                                {t('login.title')}
                            </Button>
                            {errorMessage}
                            <Divider />
                            <Button onClick={() => navigate("/account/forgot-password")} type="text" block>
                                {t('forgotPassword.title')}
                            </Button>
                            <Button onClick={() => navigate("/")} type="text" block>
                                {t('header.home')}
                            </Button>
                            <Button onClick={() => navigate("/account/register")} type="text" block>
                                {t('register.title')}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </FullPageFormContainer>
    );
}

export default Login;
