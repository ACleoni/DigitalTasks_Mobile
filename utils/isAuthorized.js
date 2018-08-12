const jwt = require('jsonwebtoken');
const { secretKey } = process.env.CLIENTSECRET || require('../config/secretKey');
const LOGGER = require('winston');

module.exports = isAuthorized = (req, res, next) => {

    if (!req.cookies || !req.cookies.token) return next();
    
    jwt.verify(req.cookies.token, secretKey, (err, data) => {
        if (err) {
            LOGGER.error(`An error occurred during the JWT verification process:\n ${err}`);
            return next(new Error("Invalid authorization."));
        }
        
        req.user = { id: data.id, email: data.email };
        return next();
    });
};

