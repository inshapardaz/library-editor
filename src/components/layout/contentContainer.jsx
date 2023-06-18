// 3rd party libraries
import { theme  } from "antd";

// Local imports
import styles from '../../styles/common.module.scss'

 // -----------------------------------------

function ContentsContainer({ children }) {
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();

    return (<div
                className={styles.container}
                style={{
                    background: colorBgContainer,
                    borderRadius : borderRadius
                }}>
            {children}
        </div>);
}

export default ContentsContainer;
