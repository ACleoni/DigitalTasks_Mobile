const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    id: { 
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true 
    },
    email: {
        type: Sequelize.STRING, allowNull: false, 
        unique: { args: true, msg: "An account with this email address already exists." }, 
        validate: { isEmail: { args: true, msg: "Please enter a valid email address"} }
    },
    password: {
        type: Sequelize.STRING, allowNull: false
    }
}, { 
    hooks: {
        beforeCreate: (User, options) => {
            User.password = _hashPassword(user.password);
        }
    }
});

const _hashPassword = async () => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}



module.exports = User;