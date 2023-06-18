import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { Button, Result } from 'antd';

//-----------------------------------------

const Error403 = () => {
    const { t } = useTranslation()

    return (<Result
        status="403"
        title={t('403.title')}
        subTitle={t('403.description')}
        extra={<Button href="/" type="primary">{t('403.action')}</Button>}
    />)
}

export default Error403;
