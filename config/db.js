const Sequelize = require('sequelize');
const sequelize = new Sequelize('taskdb', process.env.USER, '', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false
});

module.exports = sequelize;