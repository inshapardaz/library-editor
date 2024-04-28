import { useEffect } from "react";
import { useSelector } from "react-redux";

// 3rd party imports
import { App, ConfigProvider, theme } from "antd";

// Local imports
import Router from "~/src/router";
import { themeAlgorithm, selectedLanguage } from "~/src/store/slices/uiSlice";
import "~/src/styles/App.css";
//------------------------------------

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
