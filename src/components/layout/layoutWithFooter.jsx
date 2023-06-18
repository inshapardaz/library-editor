import { Layout } from "antd";
import React from "react";
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
