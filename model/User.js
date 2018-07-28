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
});

module.exports = User;