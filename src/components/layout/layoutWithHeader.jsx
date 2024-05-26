import React from 'react';
import { Outlet } from "react-router-dom";

// 3rd party libraries
import { Layout } from "antd";

// Local imports
import Footer from "./footer";
import AppHeader from "./appHeader";
import './styles.scss';

// -----------------------------------------

const LayoutWithHeader = () => {
    return (
        <Layout>
            <AppHeader />
            <Layout.Content className="contents" >
                <Outlet />
            </Layout.Content>
            <Footer />
        </Layout>)
}

export default LayoutWithHeader;
