import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ur from './ur';

const fonts = {
    'en' : null,
    'ur': [
        { value: 'AlviLahoriNastaleeq', label: 'Alvi Lahori Nastaleeq' },
        { value: 'FajerNooriNastalique', label: 'Fajer Noori Nastalique' },
        { value: 'gulzar-nastalique', label: 'Gulzar Nastalique' },
        { value: 'EmadNastaleeq', label: 'Emad Nastaleeq' },
        { value: 'NafeesWebNaskh', label: 'Nafees Web Naskh' },
        { value: 'NafeesNastaleeq', label: 'Nafees Nastaleeq' },
        { value: 'MehrNastaleeq', label: 'Mehr Nastaleeq' },
        { value: 'AdobeArabic', label: 'Adobe Arabic' },
        { value: 'Dubai', label: 'Dubai' },
        { value: 'Noto Naskh Arabic', label: 'Noto Naskh Arabic' },
        { value: 'Noto Nastaliq Urdu', label: 'Noto Nastaliq Urdu' },
        { value: 'Jameel Noori Nastaleeq', label: 'Jameel Noori Nastaleeq' },
        { value: 'jameel-khushkhati', label: 'Jameel Khushkhati' },
        { value: 'JameelNooriNastaleeqKasheeda', label: 'Jameel Noori Nastaleeq Kasheeda' }
    ]
};

export const getFonts = (language)  => fonts[language];

i18n
    // .use(Backend)
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: window.localStorage.i18nextLng || "ur",
        fallbackLng: 'en',
        // debug: true,
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
