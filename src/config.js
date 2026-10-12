let NODE_ENV = 'local';
let API_URL = 'http://localhost:4000';
let MAIN_SITE = "http://localhost:4200";
// LanguageTools (dictionary.*): spelling, dictionaries and the autocorrect/punctuation lists.
let LANGUAGE_TOOLS = "http://localhost:4500";

console.debug('--------------------------------------------------')
console.debug('window.location.host:', window.location.host);

if (window.location.host.toLocaleLowerCase() == 'editor.nawishta.dev') {
    NODE_ENV = 'development';
    API_URL = 'http://api.nawishta.dev';
    MAIN_SITE = "http://www.nawishta.dev";
    LANGUAGE_TOOLS = "http://dictionary.nawishta.dev";
    console.debug('Environment is: development');
} else if (window.location.host.toLocaleLowerCase() == 'editor.nawishta.co.uk') {
    NODE_ENV = 'production';
    API_URL = 'https://api.nawishta.co.uk';
    MAIN_SITE = "https://www.nawishta.co.uk";
    LANGUAGE_TOOLS = "https://dictionary.nawishta.co.uk";
    console.debug('Environment is: production');
} else {
    console.debug('Environment is: local');
}
console.debug('--------------------------------------------------')

export {
    NODE_ENV,
    API_URL,
    MAIN_SITE,
    LANGUAGE_TOOLS
}