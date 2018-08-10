const jwt = require('jsonwebtoken');
const { user } = require('../models').sequelize.models;
const secretKey = process.env.CLIENTSECRET || require('../config/secretKey.json').secretKey;
const bcrypt = require('bcryptjs');
const formatError = require('../utils/formatError');
const LOGGER = require('../utils/logger');

class UserService {

    async getUserById(id) {
        try {
            const userRecord = await user.findOne({ where: { id } });
            if (userRecord === null) {
                throw Error("User does not exist.");
            }
            return userRecord.dataValues;
        } catch (e) {
            LOGGER.error(`An error occurred while calling getUserByEmail: ${e}`);
            throw e;
        }
    }

    async createUser(email, password) {
        try {
            await _validateRequest(email, password);
            const userRecord = await user.create({ email, password })
                                            .then(result => result.dataValues);
            const token = await _generateUserToken(userRecord.id, email);
            return { id: userRecord.id, email: userRecord.email, token };
        } catch (e) {
            LOGGER.error(`An error occured while creating a user record: ${e}`)
            throw e;
        }
    }

    async deleteUser(email) {
        // try {
            
        // }
    }
}

const _generateUserToken = (id, email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: { id, email } }, secretKey, { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
                LOGGER.error(`An error occurred while signing a JWT: ${err}`);
                reject('An unexpected error occurred.');
            }
            resolve(token);
        });
    });
}

const _validateRequest = (email, password) => {
    return new Promise((resolve, reject) => {
        if (!password || password.length < 5) reject("Password must be atleast 5 characters.");
        if (!email) reject("Email cannot be blank.");
        resolve();
    });
}

module.exports = (new UserService());