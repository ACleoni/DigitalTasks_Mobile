const { mailTrapMailer, sgMail } = require('../utils/emailConfig');
const url = require('../config/config').base.url;
const LOGGER = require('../utils/logger');

class EmailService {

    async sendConfirmationEmail(email, token) {
        console.log('here1')
        const msg = {
            to: email,
            from: 'dcdigitaltasks@gmail.com',
            subject: 'DigitalTasks: Confirm your email address.',
            html: `Click <a href="${url + '/users/confirmation' + '?confirmation_token=' + token}">here</a> to confirm your email address`,
        };

        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            LOGGER.info('Sending confirmation email to mailtrap inbox.');
            return mailTrapMailer.sendMail(msg, (err, info) => {
                if (err) {
                    LOGGER.error('The following error occurred while sending a confirmation to mailtrap: ', err);
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