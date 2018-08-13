const apiToken = process.env.SENDGRID_TOKEN || require('../config/secretKey').emailKey;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiToken);

class EmailService {

    sendConfirmationEmail() {

    }


}

module.exports = (new EmailService());
sgMail.setApiKey(apiToken);
const msg = {
  to: 'tcampb30@gmail.com',
  from: 'dcdigitaltasks@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

try {
    sgMail.send(msg);
} catch (e) {
    console.log(e);
}