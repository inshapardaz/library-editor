// Environment config. Defaults come from the host the app is served on (no .env needed in
// production); every URL can then be overridden at runtime so one built image can be deployed
// anywhere. Precedence: window.__ENV__ (written into /env-config.js by the container at startup, see
// config/docker/40-env-config.sh) -> VITE_* vars from .env files (local dev) -> host defaults.
const runtimeEnv = window.__ENV__ ?? {};
const buildEnv = import.meta.env ?? {};

let NODE_ENV = 'local';
let API_URL = 'http://localhost:4000';
let MAIN_SITE = "http://localhost:4200";
// The Nawishta apps linked from the header (logo and app switcher). This app is LIBRARY_EDITOR_URL.
let LIBRARIES_URL = "http://localhost:4400";
let LIBRARY_EDITOR_URL = "http://localhost:4300";
// LanguageTools (dictionary.*): spelling, dictionaries and the autocorrect/punctuation lists.
let DICTIONARY_URL = "http://localhost:4500";

console.debug('--------------------------------------------------')
console.debug('window.location.host:', window.location.host);

if (window.location.host.toLocaleLowerCase() == 'editor.nawishta.dev') {
    NODE_ENV = 'development';
    API_URL = 'http://api.nawishta.dev';
    MAIN_SITE = "http://www.nawishta.dev";
    LIBRARIES_URL = "http://libraries.nawishta.dev";
    LIBRARY_EDITOR_URL = "http://editor.nawishta.dev";
    DICTIONARY_URL = "http://dictionary.nawishta.dev";
    console.debug('Environment is: development');
} else if (window.location.host.toLocaleLowerCase() == 'editor.nawishta.co.uk') {
    NODE_ENV = 'production';
    API_URL = 'https://api.nawishta.co.uk';
    MAIN_SITE = "https://www.nawishta.co.uk";
    LIBRARIES_URL = "https://libraries.nawishta.co.uk";
    LIBRARY_EDITOR_URL = "https://editor.nawishta.co.uk";
    DICTIONARY_URL = "https://dictionary.nawishta.co.uk";
    console.debug('Environment is: production');
} else {
    console.debug('Environment is: local');
}
console.debug('--------------------------------------------------')

// Runtime / build-time overrides (empty values fall through to the defaults above)
const pick = (runtimeValue, buildValue, fallback) => runtimeValue || buildValue || fallback;
NODE_ENV = pick(runtimeEnv.NODE_ENV, buildEnv.VITE_NODE_ENV, NODE_ENV);
API_URL = pick(runtimeEnv.API_URL, buildEnv.VITE_API_URL, API_URL);
MAIN_SITE = pick(runtimeEnv.MAIN_SITE, buildEnv.VITE_MAIN_SITE, MAIN_SITE);
LIBRARIES_URL = pick(runtimeEnv.LIBRARIES_URL, buildEnv.VITE_LIBRARIES_URL, LIBRARIES_URL);
LIBRARY_EDITOR_URL = pick(runtimeEnv.LIBRARY_EDITOR_URL, buildEnv.VITE_LIBRARY_EDITOR_URL, LIBRARY_EDITOR_URL);
DICTIONARY_URL = pick(runtimeEnv.DICTIONARY_URL, buildEnv.VITE_DICTIONARY_URL, DICTIONARY_URL);

// Existing name for the dictionary/language-tools app
const LANGUAGE_TOOLS = DICTIONARY_URL;

export {
    NODE_ENV,
    API_URL,
    MAIN_SITE,
    LIBRARIES_URL,
    LIBRARY_EDITOR_URL,
    DICTIONARY_URL,
    LANGUAGE_TOOLS
}
