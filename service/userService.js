const { user } = require('../models').sequelize.models;
const bcrypt = require('bcryptjs');
const LOGGER = require('winston');


class UserService {

    getUserByEmail(email) {
        const user = user.findOne({ where: { email } });
        return user.dataValues;
    }

    async createUser(email, password) {

        if (password.length < 5) throw new ValidationError("Password must be atleast 5 characters.");
        if (email.length === 0) throw new ValidationError("Email cannot be blank.")

        const userRecord = await user.create({ email, password })
                                     .then(result => result.dataValues);
                          
        return { id: userRecord.id, email: userRecord.email }
    }

}

module.exports = (new UserService());