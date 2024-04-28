import { useTranslation } from 'react-i18next';

// 3rd party imports
import { Layout } from 'antd';
import * as styles from '~/src/styles/common.module.scss';

// ----------------------------------------------

const Footer = () => {
    const { t } = useTranslation();
    const contents = (<div className={styles.footer}>
        <div className={styles['footer__copyrights']}>{t('footer.copyrights')}</div>
    </div>)
    return (<Layout.Footer style={{ textAlign: 'center' }}>{contents}</Layout.Footer>)
}

export default Footer;
