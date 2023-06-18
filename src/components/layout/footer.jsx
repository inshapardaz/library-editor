import { useTranslation } from 'react-i18next';

// 3rd party imports
import { Layout } from 'antd';
import styles from '../../styles/common.module.scss';

// ----------------------------------------------

function Footer() {
    const { t } = useTranslation();
    const contents = (<div className={styles.footer}>
        <div className={styles['footer__copyrights']}>{t('footer.copyrights')}</div>
    </div>)
    return (<Layout.Footer style={{ textAlign: 'center' }}>{contents}</Layout.Footer>)
}

export default Footer;
