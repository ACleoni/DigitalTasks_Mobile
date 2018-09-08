const apiToken = process.env.SENDGRID_TOKEN || require('../config/secretKey').emailKey;
const mailtrapAuth = process.env.MAILTRAP_AUTH || require('../config/secretKey').mailtrap.auth;
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');

exports.mailTrapMailer = (() => {
    return transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: mailtrapAuth
      });
})();

exports.sgMail = (() => {
    sgMail.setApiKey(apiToken);
    return sgMail;
})();

