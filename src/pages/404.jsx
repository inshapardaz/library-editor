import React from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { Button, Result } from 'antd';

//-----------------------------------------

const Error404 = () => {
    const { t } = useTranslation()

    return (<Result
        status="404"
        title={t('404.title')}
        subTitle={t('404.description')}
        extra={<Button href="/" type="primary">{t('404.action')}</Button>}
    />)
}

export default Error404;
