'use strict';
const bcrypt = require('bcryptjs');
const setTokenExp = require('../utils/setTokenExp')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: { 
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true 
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: { args: true, msg: "An account with this email address already exists." }, 
        validate: { isEmail: { args: true, msg: "Please enter a valid email address" } }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: { args: [5], msg: "Password must be atleast 5 characters" } }
    },
    email_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    confirmation_email_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmation_email_expiration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: setTokenExp()
    }
}, { 
    hooks: {
        beforeCreate: async (user, options) => {
            user.password = await _hashPassword(user.password);
        }
    }
  });
  return User;
}

const _hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}