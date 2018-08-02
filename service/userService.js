const jwt = require('jsonwebtoken');
const { user } = require('../models').sequelize.models;
const { secretKey } = require('../config/secretKey.json');
const bcrypt = require('bcryptjs');
const LOGGER = require('winston');


class UserService {

    getUserByEmail(email) {
        const user = user.findOne({ where: { email } });
        return user.dataValues;
    }

    async createUser(email, password, token) {

        const isValid = _validateRequest(email, password);

        const userRecord = await user.create({ email, password })
                                     .then(result => result.dataValues);

        const token = await _generateUserToken(userRecord.id, email);
        
        res.cookie("token", token);
        
        return { id: userRecord.id, email: userRecord.email }
    }
}

const _generateUserToken = (id, email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: { id, email } }, secretKey, { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
                LOGGER.error(`An error occurred while signing a JWT:\n ${err}`);
                reject("An unexpected error occurred.");
            }
            resolve(token);
        });
    });
}

const _validateRequest = (email, password) => {
    return new Promise((resolve, reject) => {
        if (password.length < 5) reject(Error("Password must be atleast 5 characters.")));
        if (email.length === 0) reject(Error("Email cannot be blank.")));
        resolve();
    })


}

module.exports = (new UserService());