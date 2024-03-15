import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ur from './ur';

const fonts = {
    'en' : null,
    'ur': [
        { value: 'AlviLahoriNastaleeq', label: 'alviLahoriNastaleeq' },
        { value: 'FajerNooriNastalique', label: 'fajerNooriNastalique' },
        { value: 'gulzar-nastalique', label: 'gulzarNastalique' },
        { value: 'EmadNastaleeq', label: 'emadNastaleeq' },
        { value: 'NafeesWebNaskh', label: 'nafeesWebNaskh' },
        { value: 'NafeesNastaleeq', label: 'nafeesNastaleeq' },
        { value: 'MehrNastaleeq', label: 'mehrNastaleeq' },
        { value: 'AdobeArabic', label: 'adobeArabic' },
        { value: 'Dubai', label: 'dubai' },
        { value: 'Noto Naskh Arabic', label: 'notoNaskhArabic' },
        { value: 'Noto Nastaliq Urdu', label: 'notoNastaliqUrdu' },
        { value: 'Jameel Noori Nastaleeq', label: 'jameelNooriNastaleeq' },
        { value: 'jameel-khushkhati', label: 'jameelKhushkhati' },
        { value: 'JameelNooriNastaleeqKasheeda', label: 'jameelNooriNastaleeqKasheeda' }
    ]
};

export const getFonts = (t, language)  => fonts[language] ? fonts[language].map(f => ({ value: f.value, label: t(`fonts.${f.label}`) })) : null;

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
