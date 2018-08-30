const { mailTrapMailer, sgMail } = require('../utils/emailConfig');
const url = require('../config/config').base.url;
const LOGGER = require('../utils/logger');

class EmailService {

    async sendConfirmationEmail(email, token) {
        const msg = {
            to: email,
            from: 'dcdigitaltasks@gmail.com',
            subject: 'DigitalTasks: Confirm your email address.',
            html: `Click <a href="${url + '/users/confirmation' + '?confirmation_token=' + token}">here</a> to confirm your email address`,
        };

        if (process.env.NODE_ENV === 'development') {
            LOGGER.info('Sending confirmation email to mailtrap inbox.');
            return mailTrapMailer.sendMail(msg, (err, info) => {
                if (error) {
                    LOGGER.error('The following error occurred while sending a confirmation to mailtrap: ', error);
                    return;
                }
                LOGGER.info('Message sent: %s', info.messageId);
            });
        } else {
            LOGGER.info(`Sending confirmation email to ${email}.`);
            await sgMail.send(msg);
        }
    }
}

module.exports = (new EmailService());