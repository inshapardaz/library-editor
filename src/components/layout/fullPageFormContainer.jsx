import { useTranslation } from 'react-i18next';

// Local import
import * as styles from '~/src/styles/common.module.scss';
import Logo from "~/src/components/layout/logo";
// ----------------------------------------------

const FullPageFormContainer = ({ title, children }) => {
    const { t } = useTranslation()

    return (<div className={styles['fullPage_layout']}>
        <div className={styles['fullPage_layout__image']}></div>
        <div className={styles['fullPage_layout__form']}>
            <div className={styles['fullPage_layout__logo']}>
                <Logo height={40} width={40} />
            </div>
            <span className={styles['fullPage_layout__title']}>{title}</span>
            {children}
        </div>
    </div>)
};

export default FullPageFormContainer;
