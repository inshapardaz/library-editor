import { createSlice } from "@reduxjs/toolkit";

// 3rd party imports
import { theme } from 'antd';
import urPK from 'antd/locale/ur_PK';
import enGB from 'antd/locale/en_GB';

const initialState = {
    mode: window.localStorage.uiMode ?? 'light',
    locale: window.localStorage.i18nextLng ?? 'ur'
};

export const languages = {
    'en': { key: "en", locale: 'en_GB', name: 'English', dir: 'ltr', isRtl : false, flag: 'gb', antdLocale: enGB },
    'ur': { key: "ur", locale: 'ur_PK', name: 'اردو', dir: 'rtl', isRtl : true, flag: 'pk', antdLocale: urPK }
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleUiMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            window.localStorage.setItem('uiMode', state.mode)
        },
        setLocale: (state, action) => {
            state.locale = action.payload;
        }
    }
})

export const uiMode = (state) => state.ui.mode;
export const themeAlgorithm = (state) => state.ui.mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
export const selectedLanguage = (state) => languages[state.ui.locale];
export const { toggleUiMode, setLocale } = uiSlice.actions;
export default uiSlice.reducer;
