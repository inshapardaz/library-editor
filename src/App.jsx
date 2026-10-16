import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// UI libraries
import { DirectionProvider, Loader, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';

// Local imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import '@/styles/appearance.css';

import Router from "./router";
import { selectedLanguage, selectedTheme, selectedUrduFont } from "@/store/slices/uiSlice";
import { createAppTheme, FORCED_COLOR_SCHEME } from "@/theme";
import { init } from '@/store/slices/authSlice';
import If from '@/components/if';
// ------------------------------------------------------------------

function App() {
    const { t } = useTranslation();
    const lang = useSelector(selectedLanguage);
    const userLoadStatus = useSelector((state) => state?.auth?.loadUserStatus)
    const dispatch = useDispatch();

    const themeName = useSelector(selectedTheme);
    const urduFont = useSelector(selectedUrduFont);
    const theme = useMemo(() => createAppTheme(themeName), [themeName]);

    // The palette and the Urdu typeface (see styles/appearance.css) are attributes on <html>
    useEffect(() => {
        document.documentElement.setAttribute('data-nw-theme', themeName);
    }, [themeName]);
    useEffect(() => {
        document.documentElement.setAttribute('data-urdu-font', urduFont);
    }, [urduFont]);

    useEffect(() => {
        if (userLoadStatus === 'idle')
            dispatch(init());
    }, [dispatch, userLoadStatus]);

    const currentLocal = lang ? lang.locale : 'en';
    return (
        <>
            {/* <HelmetProvider>
        <Helmet htmlAttributes={{ lang: currentLocal }}>
          <title>{t('app')}</title>
        </Helmet> */}
            <DirectionProvider >
                <MantineProvider theme={theme} defaultColorScheme="auto" forceColorScheme={FORCED_COLOR_SCHEME[themeName]}>
                    <DatesProvider settings={{ locale: currentLocal }}>
                        <Notifications limit={5} position="bottom-right" />
                        <ModalsProvider labels={{ confirm: t('actions.yes'), cancel: t('actions.no') }}>
                            <If condition={userLoadStatus === 'loading'}
                                elseChildren={<Router />}>
                                <div style={{ position: 'fixed', top: '50%', left: '50%' }}><Loader /></div>
                            </If>
                        </ModalsProvider>
                    </DatesProvider>
                </MantineProvider>
            </DirectionProvider>
            {/* </HelmetProvider> */}
        </>
    )
}

export default App
