import React from 'react';

// Third party libraries
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

// local imports
import Footer from "./footer";
// -----------------------------------

const LayoutWithFooter = () => {
    return <Layout>
        <Outlet />
        <Footer stickToBottom />
    </Layout>;
}

export default LayoutWithFooter;
