const UserService = require('../service/UserService');
const EmailService = require('../service/EmailService');
const LOGGER = require('../utils/logger');

exports.confirmationGet = async (req, res) => {
    const confirmationEmailToken = req.query.confirmation_token;
    try {
        const { isConfirmed, email } = await UserService.confirmEmailAddress(confirmationEmailToken);
        if (isConfirmed) {
        res.render('confirmEmail', {
            tokenExpired: false,
            email
         });
        } 
    } catch (e) {
        res.status(401);
        res.send(e);
    }
}

exports.resendConfirmation = async (req, res) => {
    const email = req.query.email;
    try {
        await EmailService.resendConfirmationEmail(email);
        res.render('confirmEmail', {
            isResend: true,
            email
         });
    } catch (e) {
        console.log(e);
        res.status(401);
        res.send(e);
    }
}