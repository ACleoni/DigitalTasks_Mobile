const UserService = require('../service/UserService');

exports.confirmationGet = async (req, res) => {
    const confirmationEmailToken = req.query.confirmation_token;
    try {
        const isConfirmed = await UserService.confirmEmailAddress(confirmationEmailToken);
        if (isConfirmed) res.send('<h1>Email Confirmed</h1>')
    } catch (e) {
        res.send(e);
    }
    /* Find by confirmation token and update account */
    /* UserService.confirmAccount(confirmationToken); */
    /* Add unit tests prior to creating account */
}