export const API_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3500'
        : 'https://amazon-clone-api-1729beffe502.herokuapp.com';