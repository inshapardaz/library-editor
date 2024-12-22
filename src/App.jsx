import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// UI libraries
import { DirectionProvider, Loader, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

// Local imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';

import Router from "./router";
import { selectedLanguage } from "@/store/slices/uiSlice";
import { init } from '@/store/slices/authSlice';
// ------------------------------------------------------------------

function App() {
  const { t } = useTranslation();
  const lang = useSelector(selectedLanguage);
  const userLoadStatus = useSelector((state) => state?.auth?.loadUserStatus)
  const dispatch = useDispatch();

  useEffect(() => {
    if (userLoadStatus === 'idle')
      dispatch(init());
  }, [dispatch, userLoadStatus]);

  return (
    <>
      <HelmetProvider>
        <Helmet htmlAttributes={{ lang: lang ? lang.locale : 'en' }}>
          <title>{t('app')}</title>
        </Helmet>
        <DirectionProvider >
          <MantineProvider>
            <Notifications limit={5} position="bottom-right" />
            <ModalsProvider labels={{ confirm: t('actions.yes'), cancel: t('actions.no') }}>
              {userLoadStatus === 'loading' ? <Loader /> : <Router />}
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
      </HelmetProvider>
    </>
  )
}

export default App
