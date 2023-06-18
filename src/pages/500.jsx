import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { Button, Result } from 'antd';

//-----------------------------------------

const Error500 = () => {
    const { t } = useTranslation()

    return (<Result
        status="500"
        title={t('500.title')}
        subTitle={t('500.description')}
        extra={<Button href="/" type="primary">{t('500.action')}</Button>}
    />)
}

export default Error500;
