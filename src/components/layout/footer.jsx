import React from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party imports
import { Layout } from 'antd';

// Local imports
import './styles.scss';
import { NODE_ENV } from "env";

// ----------------------------------------------

const Footer = () => {
    const { t } = useTranslation();
    const contents = (<div className="footer">
        <div className="footer__copyrights">{t('footer.copyrights')}{NODE_ENV != 'production' ? `- (${NODE_ENV})` : null}</div>
    </div>)
    return (<Layout.Footer style={{ textAlign: 'center' }}>{contents}</Layout.Footer>)
}

export default Footer;
