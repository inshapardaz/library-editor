import { Link } from "react-router-dom";

// 3rd party imports
import { Space } from 'antd';

// Local import
import styles from '../../styles/common.module.scss';

// ---------------------------------------------------
export function Logo() {
  return (<Space size={8} className={styles['header__logo']}>
      <Link to="/" className={styles["header__logo-text"]}>
        <img src="/images/logo.png" alt="logo" height={24} width={24} />
      </Link>
    </Space>)
}
