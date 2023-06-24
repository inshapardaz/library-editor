import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ur from './ur';

i18n
    // .use(Backend)
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: window.localStorage.i18nextLng || "ur",
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en : {
                translation: en
            },
            ur: {
                translation: ur
            }
        }
    });

export default i18n;
