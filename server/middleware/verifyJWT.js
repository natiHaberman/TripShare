const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

// Checks header for Bearer token and verifies it using access token secret
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        const error = new HttpError('Please log in.', 401);
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                const error = new HttpError('Unathorized access', 403);
                return next(error);
            }
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT