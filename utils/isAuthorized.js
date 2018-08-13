const jwt = require('jsonwebtoken');
const secretKey = process.env.CLIENTSECRET || require('../config/secretKey.json').secretKey;
const LOGGER = require('winston');

module.exports = isAuthorized = (req, res, next) => {

    if (!req.cookies || !req.cookies.token) return next();
    
    jwt.verify(req.cookies.token, secretKey, (err, data) => {
        if (err) {
            LOGGER.error(`An error occurred during the JWT verification process:\n ${err}`);
            return next();
        }
        
        req.user = { id: data.id, email: data.email };
        return next();
    });
};

