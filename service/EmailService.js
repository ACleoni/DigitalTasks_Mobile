const apiToken = process.env.SENDGRID_TOKEN || require('../config/secretKey').emailKey;
const url = require('../config/config').base.url;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiToken);

class EmailService {

    async sendConfirmationEmail(email, token) {
        const msg = {
            to: email,
            from: 'dcdigitaltasks@gmail.com',
            subject: 'DigitalTasks: Confirm your email address.',
            html: `Click <a href="${url/token}">here</a> to confirm your email address`,
        };
        sgMail.send(msg);
    }
}

module.exports = (new EmailService());