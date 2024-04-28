import { Outlet } from "react-router-dom";

// 3rd party libraries
import { Layout } from "antd";

// Local imports
import Footer from "./footer";
import AppHeader from "./appHeader";
import * as styles from '~/src/styles/common.module.scss'

// -----------------------------------------

function LayoutWithHeader() {
    return (
        <Layout>
            <AppHeader />
            <Layout.Content className={styles.contents} >
                <Outlet />
            </Layout.Content>
            <Footer />
        </Layout>)
}

export default LayoutWithHeader;
