const allowedOrigins = require('./allowedOrigins');
console.log("allowedOrigins", allowedOrigins)
// CORS options for CORS middleware
const corsOptions = {
    // origin: (origin, callback) => {
    //     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    //         callback(null, true)
    //     } else {
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // },
    origin: (origin, callback) => {
        callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
}

module.exports = corsOptions;

  