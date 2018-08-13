const sequelize = require('sequelize');

const errorFormatter = (e) => {
    if (e instanceof sequelize.Error) {
        if (e instanceof sequelize.ValidationError) {
            return e.errors[0].message;
        }
        return "An unexpected error occurred";
    }
    return e;
}

module.exports = errorFormatter;

