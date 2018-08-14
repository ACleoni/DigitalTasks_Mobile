// const apiToken = process.env.SENDGRID_TOKEN || require('../config/secretKey').emailKey;
// const sgMail = require('@sendgrid/mail');
// const crypto = require('crypto');
// const UserService = require('./UserService');
// sgMail.setApiKey(apiToken);

// class EmailService {

//     async sendConfirmationEmail(email) {
//         const token = await new Promise((resolve,reject) => {
//             crypto.randomBytes(32, (err, buf) => {
//                 if (err) reject(err);
//                 resolve(buf.toString('hex'));
//             });
//         });
//         UserService.

//             (resolvecrypto.randomBytes(32, )
//         const msg = {
//             to: email,
//             from: 'dcdigitaltasks@gmail.com',
//             subject: 'DigitalTasks: Confirm your email address',
//             html: `Click <a href="${}">here</a> to confirm your email address`,
//           };
//         sgMail.send(msg);
//     }


// }

// module.exports = (new EmailService());
// sgMail.setApiKey(apiToken);
// const msg = {
//   to: 'tcampb30@gmail.com',
//   from: 'dcdigitaltasks@gmail.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// try {
//     sgMail.send(msg);
// } catch (e) {
//     console.log(e);
// }