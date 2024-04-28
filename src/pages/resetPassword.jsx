import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from "react-router-dom";

// 3rd party libraries
import { App, Button, Form, Input, Space, Divider, Spin, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';

// Internal imports
import FullPageFormContainer from '~/src/components/layout/fullPageFormContainer';
import {
  resetPassword,
  getResetPasswordError,
  getResetPasswordStatus
} from '~/src/store/slices/authSlice';


function ResetPassword() {
  const { message } = App.useApp();
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const status = useSelector(getResetPasswordStatus)
  const error = useSelector(getResetPasswordError)

  useEffect(() => {
    if (!code) {
      message.error(t('resetPassword.noCode'))
      navigate('/')
    }
  }, [code, message, navigate, t])

  const onSubmit = ({ password, confirmPassword }) => {
    dispatch(resetPassword({ code, password, confirmPassword }))
      .then(() => {
        message.success(t('resetPassword.success'))
        navigate('/account/login')
      })
  };

  const errorMessage = error ? (<Alert showIcon message={t('resetPassword.error')} type="error" />) : null

  return (
    <FullPageFormContainer title={t('resetPassword.title')}>
      <Spin spinning={status === 'loading'}>
        <Form name="reset-password" onFinish={onSubmit}
        >
          <Form.Item name="password" hasFeedback
            rules={[
              {
                required: true,
                message: t('resetPassword.password.required'),
              },
              {
                type: 'string',
                min: 6,
                message: t('resetPassword.password.length'),
              }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder={t('resetPassword.password.label')}
            />
          </Form.Item>
          <Form.Item name="confirmPassword" hasFeedback
            rules={[
              {
                required: true,
                message: t('resetPassword.confirmPassword.required'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('resetPassword.confirmPassword.match')));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={t('resetPassword.confirmPassword.label')}
            />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" block>
                {t('resetPassword.submit')}
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
}

export default ResetPassword;
