'use strict';
const bcrypt = require('bcryptjs');

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
        validate: { len: { args: [7], msg: "Password must be atleast 7 characters" } }
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