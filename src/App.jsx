import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// 3rd party imports
import { App, ConfigProvider } from "antd";

import { theme } from "antd";

// Local imports
import Router from "./router";
import { themeAlgorithm, selectedLanguage } from "./features/ui/uiSlice";
import "./styles/App.css";

// -------------------------------

const MyApp = () => {
    const themeAlgo = useSelector(themeAlgorithm);
    const lang = useSelector(selectedLanguage);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        document.documentElement.style.backgroundColor = document.body.style.backgroundColor = colorBgContainer;
    }, [colorBgContainer]);

    return (
        <ConfigProvider
            direction={lang ? lang.dir : "ltr"}
            locale={lang ? lang.antdLocale : "en"}
            componentSize="large"
            theme={{
                algorithm: themeAlgo,
            }}
        >
            <App>
                <Router />
            </App>
        </ConfigProvider>
    );
};

export default MyApp;
