import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { Alert, Button, Form, Input, Space, Spin, Switch } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

// Internal imports
import { axiosPublic } from "../helpers/axios.helpers";
import styles from '../styles/common.module.scss'

// ---------------------------------------------------------------

function getFileName(response) {
    var contentDisposition = response.request.getResponseHeader('Content-Disposition');
    var match = contentDisposition.match(/filename\s*=\s*"?(.+)"?;/i);
    return match[1];
}
// ---------------------------------------------------------------

const DownloadRekhta = () => {
    const { t } = useTranslation()
    const [isBusy, setIsBusy] = useState(false);
    const [error, setError] = useState(false)

    const onSubmit = async ({ bookUrl, convertToPdf }) => {
        const convertToPdfValue = convertToPdf === "true";

        try {
            setIsBusy(true);
            setError(false);
            const response = await axiosPublic({
                url: '/tools/rekhtadownload',
                method: 'POST',
                responseType: 'blob',
                data: { bookUrl, convertToPdf : convertToPdfValue }
            })

            // create file link in browser's memory
            const href = URL.createObjectURL(response.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            //link.setAttribute('download', convertToPdfValue ? "file.pdf" : 'file.zip'); //or any other extension
            link.setAttribute('download', getFileName(response));
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err.message)
            setError(true)
            return Promise.reject(err.message)
        } finally
        {
            setIsBusy(false);
        }
    };

    const errorMessage = error ? (<Alert  showIcon message={t('downloader.error')} type="error" />) : null

    return (
        <Spin spinning={isBusy} tip={t('downloader.loading')} >
            <div className={styles.downloader}>
                <h2>{t('downloader.title') }</h2>
                <h5>{t('downloader.description') }</h5>
                <Form name="rekhta-download" onFinish={onSubmit} >
                    <Form.Item name="bookUrl"
                        rules={[
                        {
                            required: true,
                            message: t('downloader.url.required'),
                        }, {
                            type: 'url'
                        }, {
                            validator: async (rule, value) => {
                                if (value && value.toLowerCase().includes('/ebooks/detail/')) {
                                    throw new Error(t('downloader.url.detailsLink'));
                                }
                            }
                        }]}>
                        <Input prefix={<GlobalOutlined className="site-form-item-icon" />} placeholder={t('downloader.url.title')} />
                    </Form.Item>
                    <Form.Item valuePropName="checked"
                        name="convertToPdf" initialValue="true">
                        <Switch defaultChecked={true}
                            checkedChildren={t('downloader.convertToPdf.pdf')}
                            unCheckedChildren={t('downloader.convertToPdf.images')} />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button type="primary" htmlType="submit" block>
                                {t('downloader.title')}
                            </Button>
                            {errorMessage}
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default DownloadRekhta;
