const UserService = require('../service/UserService');

exports.confirmationGet = async (req, res) => {
    const confirmationEmailToken = req.query.confirmation_token;
    try {
        const isConfirmed = await UserService.confirmEmailAddress(confirmationEmailToken);
        if (isConfirmed) res.sendFile(__dirname + 'public/confirmation.html');
    } catch (e) {
        res.status(401);
        res.send(e);
    }
}

/* Resend confirmation email */
/* Password reset email */
/* Delete user account */