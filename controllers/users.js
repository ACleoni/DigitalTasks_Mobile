const UserService = require('../service/UserService');

exports.confirmationGet = (req, res) => {
    const confirmationToken = req.query.confirmation_token;
    // UserService
    /* Find by confirmation token and update account */
    /* UserService.confirmAccount(confirmationToken); */
    /* Add unit tests prior to creating account */
}