import { useEffect /*, useState*/ } from 'react';
import { useTranslation } from 'react-i18next';
//import { useNavigate, useSearchParams } from "react-router-dom";

// 3rd party libraries
import { /*App,*/ Button, Form, Input, Checkbox, Space, Divider } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

// Internal imports
//import * as styles from '~/src/styles/common.module.scss'
//import accountService from '@/services/accountService';
import FullPageFormContainer from '~/src/components/layout/fullPageFormContainer';

// ------------------------------------------------------

function Register() {
    //const { message } = App.useApp();
    const { t } = useTranslation()
    //const navigate = useNavigate();
    //const [searchParams] = useSearchParams();
    //const [busy, setBusy] = useState(false);

    useEffect(() => {
        //const { code } = searchParams.has('get') ?  searchParams.get('code') : '';
        //if (code) {
        //   accountService.verifyInvite(code)
        //     .then(() => setBusy(false))
        //     .catch((e) => {
        //       setBusy(false);
        //       if (e.status === 410) {
        //         message.error(t('register.invitation.expired'));
        //         navigate('/');
        //       } else if (e.status === 404) {
        //         message.error(t('register.invitation.notFound'));
        //         navigate('/');
        //       } else {
        //         navigate('/500');
        //       }
        //     });
        // } else {
        //   navigate('/');
        // }
    }, []);

    const onSubmit = () => null;
    //const onSubmit = (fields, { setSubmitting }) => {
    //const { code } = searchParams.has('get') ?  searchParams.get('code') : '';
    // accountService.register(code, fields)
    //   .then(() => message.success(t('register.success')))
    //   .then(() => navigate('/'))
    //   .catch(() => message.error(t('register.error')))
    //   .finally(() => setSubmitting(false));
    //};

    return (
        <FullPageFormContainer title={t('register.title')}>
            <Form name="register" onFinish={onSubmit}
            >
                <Form.Item name="name" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('register.name.required'),
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('register.name.label')} />
                </Form.Item>
                <Form.Item name="password" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('register.password.required'),
                        },
                        {
                            type: 'string',
                            min: 6,
                            message: t('register.password.length'),
                        }
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder={t('register.password.label')}
                    />
                </Form.Item>
                <Form.Item name="confirmPassword" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('register.confirmPassword.required'),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('register.confirmPassword.match')));
                            },
                        }),
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder={t('register.confirmPassword.label')}
                    />
                </Form.Item>
                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t('register.acceptTerms.requires'))),
                        },
                    ]}
                >
                    <Checkbox>
                        {t('register.acceptTerms.title')}
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" htmlType="submit" block>
                            {t('register.submit')}
                        </Button>
                        <Divider />
                        <Button type="text" block href="/account/login">
                            {t('login.title')}
                        </Button>
                        <Button href="/" type="text" block> {t('header.home')}</Button>
                    </Space>
                </Form.Item>
            </Form>
        </FullPageFormContainer>
    );
}

export default Register;
