import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet, HelmetProvider } from 'react-helmet-async';

// 3rd party imports
import { App, ConfigProvider, theme } from "antd";

// Local imports
import Router from "/src/router";
import { themeAlgorithm, selectedLanguage } from "/src/store/slices/uiSlice";
import { init } from '/src/store/slices/authSlice';
import Loading from '/src/components/common/loader';

//----------------------------------------------

const TheApp = () => {
  const themeAlgo = useSelector(themeAlgorithm);
  const lang = useSelector(selectedLanguage);
  const userLoadStatus = useSelector((state) => state?.auth?.loadUserStatus)
  const dispatch = useDispatch();

  useEffect(() => {
    if (userLoadStatus === 'idle')
      dispatch(init());
  }, [dispatch, userLoadStatus]);

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
      <HelmetProvider>
        <Helmet htmlAttributes={{ lang: lang ? lang.locale : 'en' }} />
        <App>
          {userLoadStatus === 'loading' ? <Loading /> : <Router />}
        </App>
      </HelmetProvider>
    </ConfigProvider>
  );
};

export default TheApp;
