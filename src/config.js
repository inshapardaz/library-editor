let NODE_ENV = 'local';
let API_URL = 'http://localhost:4000';

console.log('--------------------------------------------------')
console.log('window.location.host:', window.location.host);

if (window.location.host.toLocaleLowerCase() === 'nawihta.dev') {
    NODE_ENV = 'development';
    API_URL = 'http://api.nawistha.dev';
} else if (window.location.host.toLocaleLowerCase() === 'editor.nawishta.co.uk' > 0) {
    NODE_ENV = 'development';
    API_URL = 'https://api.nawistha.co.uk';
}
console.log('--------------------------------------------------')

export {
    NODE_ENV,
    API_URL
}