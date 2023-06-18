import { Outlet } from "react-router-dom";

// 3rd party libraries
import { Layout  } from "antd";

// Local imports
import Footer from "./footer";
import AppHeader from "./appHeader";
import styles from '../../styles/common.module.scss'
import LibraryProvider from '../../helpers/library.context';

 // -----------------------------------------

function LayoutWithHeader() {
    return (<LibraryProvider>
        <Layout>
            <AppHeader />
            <Layout.Content className={styles.contents} >
                <Outlet />
            </Layout.Content>
            <Footer/>
        </Layout>
    </LibraryProvider>)
}

export default LayoutWithHeader;
