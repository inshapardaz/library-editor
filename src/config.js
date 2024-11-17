let NODE_ENV = 'local';
let API_URL = 'http://localhost:4000';
let COOKIE_DOMAIN = 'localhost';

console.log('--------------------------------------------------')
console.log('window.location.host:', window.location.host);

if (window.location.host.toLocaleLowerCase() == 'editor.nawishta.dev') {
    NODE_ENV = 'development';
    API_URL = 'http://api.nawishta.dev';
    COOKIE_DOMAIN = '.nawishta.dev';
    console.log('Environment is: development');
} else if (window.location.host.toLocaleLowerCase() == 'www.nawishta.co.uk' ||
    window.location.host.toLocaleLowerCase() == 'nawishta.co.uk') {
    NODE_ENV = 'production';
    API_URL = 'https://api.nawishta.co.uk';
    COOKIE_DOMAIN = '.nawishta.co.uk';
    console.log('Environment is: production');
} else {
    console.log('Environment is: local');
}
console.log('--------------------------------------------------')

export {
    NODE_ENV,
    API_URL,
    COOKIE_DOMAIN
}