const jwt = require('jsonwebtoken');
const errorFormatter = require('../utils/errorFormatter');
const { user } = require('../models').sequelize.models;
const secretKey = process.env.CLIENTSECRET || require('../config/secretKey.json').secretKey;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const LOGGER = require('../utils/logger');


class UserService {

    async getUserById(id) {
        try {
            const userRecord = await user.findById(id);
            if (userRecord === null) throw "User does not exist.";
            return userRecord.dataValues;
        } catch (e) { 
            LOGGER.error(`An error occurred while calling getUserById: ${e}`);
            throw errorFormatter(e);
        }
    }

    async getUserByEmail(email) {
        try {
            const userRecord = await user.findOne({ where: { email } });
            if (userRecord === null) throw "User does not exist.";
            return userRecord.dataValues;
        } catch (e) {
            LOGGER.error(`An error occurred while calling getUserByEmail: ${e}`);
            throw errorFormatter(e);
        }
    }

    async getUserTokenByEmailAndPassword(email, password) {
        try {
            await _validateRequest(email, password);
            const userRecord = await this.getUserByEmail(email);
            const isAuthorized = await _isAuthorized(password, userRecord.password);

            if (isAuthorized) {
                return { 
                    id: userRecord.id,
                    userEmail: userRecord.email,
                    token: await _generateUserToken(userRecord.id, userRecord.email)
                }
            } 
            throw "Invalid password."
        } catch (e) {
            LOGGER.error(`An error occured while calling getUserByEmailAndPassword: ${e}`)
            throw errorFormatter(e);
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
            LOGGER.error(`An error occured while creating a user record: ${e}`);
            throw errorFormatter(e);
        }
    }

    async deleteUserById(email) {
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
        if (!email) reject("Email cannot be blank.");
        if (!validator.isEmail(String(email))) reject("Email format is invalid.");
        if (!password) reject("Password cannot be blank.");
        resolve();
    });
}

const _isAuthorized = (password, hash) => {
    return bcrypt.compare(password, hash);
}

module.exports = (new UserService());