const EmailService = require('../../service/EmailService');
const sgMail = require('@sendgrid/mail');

describe('EmailService', () => {
    describe('sendConfirmationEmail', () => {
        let token = '12e2d9xj38dj32-ad2';
        it('should send confirmation email', () => {
            sgMail.send = jest.fn(() => null);
            EmailService.sendConfirmationEmail("test@test.com", token);
            expect(sgMail.send).toHaveBeenCalledTimes(1);
        });
    });
})