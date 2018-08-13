const jwt = require('jsonwebtoken');
const secretKey = process.env.CLIENTSECRET || require('../config/secretKey').secretKey;
const LOGGER = require('winston');

module.exports = isAuthorized = (req, res, next) => {

    if (!req.cookies || !req.cookies.token) return next();
    
    jwt.verify(req.cookies.token, secretKey, (err, decoded) => {
        if (typeof decoded === 'undefined') {
            LOGGER.error(`Invalid token.`);
            return next();
        } else if (err) {
            LOGGER.error(`An error occurred during the JWT verification process:\n ${err}`);
            return next();
        }
        const { data } = decoded;
        req.user = { id: data.id, email: data.email };
        return next();
    });
};

