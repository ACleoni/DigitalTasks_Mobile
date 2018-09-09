const jwt = require('jsonwebtoken');
const errorFormatter = require('../utils/errorFormatter');
const { user } = require('../models').sequelize.models;
const secretKey = process.env.CLIENTSECRET || require('../config/secretKey').secretKey;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const EmailService = require('./EmailService');
const setTokenExp = require('../utils/setTokenExp');
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
            const confirmationEmailToken = await _generateEmailToken();
            const userRecord = await user.create({ email, password, confirmationEmailToken })
                                         .then(result => result.dataValues);
            const token = await _generateUserToken(userRecord.id, userRecord.email);
            await EmailService.sendConfirmationEmail(userRecord.email, userRecord.confirmationEmailToken);
            return { id: userRecord.id, email: userRecord.email, token };
        } catch (e) {
            LOGGER.error(`An error occured while creating a user record: ${e}`);
            throw errorFormatter(e);
        }
    }

    async deleteUserById(id) {
        try {
            const userRecord = await user.findById(id);
            if (userRecord === null) throw "User does not exist.";
            await user.destroy({ where: { id: userRecord.dataValues.id } });
        } catch (e) {
            LOGGER.error(`An error occured while deleting user record: ${e}`);
            throw errorFormatter(e);
        }
    }

    async updateEmailConfirmationToken(email) {
        try {
            const updatedColumns = { confirmation_email_expiration_date: setTokenExp() }
            const result = await user.update(updatedColumns, { where: { email } });
            if (result[0] < 1) throw "Unable to update confirmation token by user email.";
            return result[0];
        } catch (e) {
            LOGGER.error(`An error occurred during updateConfirmationToken(): ${e}`);
            throw errorFormatter(e);
        }
    }

    async confirmEmailAddress(confirmationEmailToken) {
        try {
            const userRecord = await _getUser({ confirmationEmailToken });
            
            if (userRecord === null) throw "Invalid Token.";

            if (userRecord.dataValues.emailConfirmed) return true;
            
            if ((new Date()) >= userRecord.dataValues.confirmationEmailExpirationDate) throw "Token expired."
            
            const result = await this.updateUser({ emailConfirmed: true }, { confirmationEmailToken });
            return (result[0] > 0);
        } catch (e) {
            LOGGER.error(`An error occurred during confirmEmailAddress(): ${e}`);
            throw errorFormatter(e);
        }
    }

    async updateUser(updates, searchCriteria) {
        try {
            const result = await user.update(updates, { where: searchCriteria });
            if (result[0] < 1) throw "Unable to update user record.";
            return result;
        } catch (e) {
            LOGGER.error(`An error occurred during updateUser(): ${e}`);
            throw errorFormatter(e);
        }
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

const _generateEmailToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('hex'));
        });
    });
}

const _getUser = async (searchCriteria) => {
     return await user.findOne({ where: searchCriteria });
}

module.exports = (new UserService());