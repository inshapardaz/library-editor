let NODE_ENV = 'local';
let API_URL = 'http://localhost:4000';

if (window.location.host.substring('nawihta.dev') > 0) {
    NODE_ENV = 'development';
    API_URL = 'http://api.nawistha.dev';
} else if (window.location.host.substring('nawihta.co.uk') > 0) {
    NODE_ENV = 'development';
    API_URL = 'https://api.nawistha.co.uk';
}

export {
    NODE_ENV,
    API_URL
}