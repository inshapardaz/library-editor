import React from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party imports
import { Layout } from 'antd';
import './styles.scss';

// ----------------------------------------------

const Footer = () => {
    const { t } = useTranslation();
    const contents = (<div className="footer">
        <div className="footer__copyrights">{t('footer.copyrights')}</div>
    </div>)
    return (<Layout.Footer style={{ textAlign: 'center' }}>{contents}</Layout.Footer>)
}

export default Footer;
