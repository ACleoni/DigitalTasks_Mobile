const User = require('../models/tables/user');
const bcrypt = require('bcryptjs');
const LOGGER = require('../config/logger');

class UserService {

    getUserByEmail(email) {
        const user = User.findOne({ where: { email } });
        return user.dataValues;
    }

    async createUser(email, password) {

        if (password.length < 5) {
            throw Error("Password must be 5 characters or greater.");
        } 

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return User.create(email, hashedPassword).then((user) => user.dataValues);
        } catch (e) {
            LOGGER.error(`The following error occurred while password hashing:\n ${e}`);
            throw Error("An unexpected error occurred.");
        }
    }

}

module.exports = (new UserService());