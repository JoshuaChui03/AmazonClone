const allowedOrigins = [
    'http://localhost:3500',
    'http://127.0.0.1:3500',
    'http://localhost:63342'
];

// if (process.env.FRONTEND_URL) {
//     allowedOrigins.push(process.env.FRONTEND_URL);
// }

module.exports = allowedOrigins;