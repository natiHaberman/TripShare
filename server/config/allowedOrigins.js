// Allowed origins for CORS middleware

const allowedOrigins = [
    `${process.env.REACT_APP_BACKEND_URL}`,
    `${process.env.REACT_APP_FRONTEND_URL}`
];

module.exports = allowedOrigins;