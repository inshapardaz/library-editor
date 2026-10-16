import { createSlice } from "@reduxjs/toolkit";

// 3rd party imports
import Cookies from 'js-cookie'

// Local imports
import { THEMES, DEFAULT_THEME } from '@/theme'

import enDictionary from '@/i18n/wordLists/en'
import urDictionary from '@/i18n/wordLists/ur'
//----------------------------------------

// Appearance choices live in local storage. It can throw (private mode, blocked site data), so
// every access is guarded and the defaults apply.
const readSetting = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};
const writeSetting = (key, value) => {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // ignore: remembering the choice is a convenience only
    }
};

export const URDU_FONTS = ['nastaleeq', 'naskh'];
const storedUrduFont = readSetting('urduFont');
const storedTheme = readSetting('uiTheme');
const initialTheme = THEMES.includes(storedTheme) ? storedTheme : DEFAULT_THEME;
// Set before first render so the page never flashes the wrong palette.
document.documentElement.setAttribute('data-nw-theme', initialTheme);

const detectedLanguage = window.localStorage.i18nextLng ?? "ur";

export const languages = {
    en: {
        key: `en`,
        locale: "en_GB",
        name: "English",
        dir: "ltr",
        isRtl: false,
    },
    ur: {
        key: `ur`,
        locale: "ur_PK",
        name: "اردو",
        dir: "rtl",
        isRtl: true
    },
};

const lang = languages[detectedLanguage];
if (lang) {
    document.querySelector("html").setAttribute("dir", lang.dir);
    document.querySelector("html").setAttribute("lang", lang.locale);
    document.querySelector("body").setAttribute("dir", lang.dir);
}

export const uiSlice = createSlice({
    name: "ui",
    initialState: {
        mode: window.localStorage.uiMode ?? "light",
        theme: initialTheme,
        urduFont: URDU_FONTS.includes(storedUrduFont) ? storedUrduFont : 'nastaleeq',
        locale: detectedLanguage,
        readerFont: Cookies.get('reader-font') ?? 'AdobeArabic',
        readerFontSize: parseInt(Cookies.get('reader-font-size'), 10) ?? 16,
        readerTheme: Cookies.get('reader-theme') ?? 'White',
        readerView: Cookies.get('reader-view') ?? 'scroll',
        readerLineHeight: Cookies.get('reader-line-height') ?? '1.5',
    },
    reducers: {
        toggleUiMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            window.localStorage.setItem("uiMode", state.mode);
        },
        setUiMode: (state, action) => {
            window.localStorage.setItem("uiMode", action.payload);
        },
        setLocale: (state, action) => {
            state.locale = action.payload;
            window.localStorage.i18nextLng = action.payload;
            const lang = languages[action.payload];
            if (lang) {
                document.querySelector("html").setAttribute("dir", lang.dir);
                document.querySelector("html").setAttribute("lang", lang.locale);
                document.querySelector("body").setAttribute("dir", lang.dir);
            }
        },
        setTheme: (state, action) => {
            if (!THEMES.includes(action.payload)) return;
            state.theme = action.payload;
            writeSetting('uiTheme', action.payload);
            document.documentElement.setAttribute('data-nw-theme', action.payload);
        },
        setUrduFont: (state, action) => {
            if (!URDU_FONTS.includes(action.payload)) return;
            state.urduFont = action.payload;
            writeSetting('urduFont', action.payload);
        },
        setReaderFont: (state, action) => {
            state.readerFont = action.payload;
            Cookies.set('reader-font', action.payload)
        },
        setReaderFontSize: (state, action) => {
            state.readerFontSize = action.payload;
            Cookies.set('reader-font-size', action.payload)
        },
        setReaderTheme: (state, action) => {
            state.readerTheme = action.payload;
            Cookies.set('reader-theme', action.payload)
        },
        setReaderView: (state, action) => {
            state.readerView = action.payload;
            Cookies.set('reader-view', action.payload)
        },
        setReaderLineHeight: (state, action) => {
            state.readerLineHeight = action.payload;
            Cookies.set('reader-line-height', action.payload)
        },
    },
});

export const {
    toggleUiMode,
    setLocale,
    setUiMode,
    setTheme,
    setUrduFont,
    setReaderFont,
    setReaderFontSize,
    setReaderTheme,
    setReaderView,
    setReaderLineHeight
} = uiSlice.actions;
export const selectedTheme = (state) => state.ui.theme;
export const selectedUrduFont = (state) => state.ui.urduFont;
export const selectedLanguage = (state) => languages[state.ui.locale];
export function autoCompleteList(state) {
    switch (state.ui.locale) {
        case 'en':
            return enDictionary;
        case 'ur':
            return urDictionary;
        default:
            return [];

    }
}
