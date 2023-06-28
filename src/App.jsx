import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// 3rd party imports
import { App, ConfigProvider } from "antd";

// Local imports
import Router from "./router";
import { themeAlgorithm, selectedLanguage } from "./features/ui/uiSlice";
import "./styles/App.css";

// -------------------------------

const MyApp = () => {
    const theme = useSelector(themeAlgorithm);
    const lang = useSelector(selectedLanguage);

    return (
        <ConfigProvider
            direction={lang ? lang.dir : "ltr"}
            locale={lang ? lang.antdLocale : "en"}
            componentSize="large"
            theme={{
                algorithm: theme,
            }}
        >
            <App>
                <Router />
            </App>
        </ConfigProvider>
    );
};

export default MyApp;
