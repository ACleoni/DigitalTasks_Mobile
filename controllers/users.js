const UserService = require('../service/UserService');

exports.confirmationGet = async (req, res) => {
    const confirmationEmailToken = req.query.confirmation_token;
    try {
        const isConfirmed = await UserService.confirmEmailAddress(confirmationEmailToken);
        if (isConfirmed) res.send('<h1>Email Confirmed</h1>')
    } catch (e) {
        res.status(401);
        res.send(e);
    }
}