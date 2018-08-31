const request = require('supertest');
const EmailService = require('../../../service/EmailService');
// const sequelize = require('../../../models').sequelize;
const UserService = require('../../../service/UserService');
const app = require('../../../app');
let server;
jest.mock('../../../service/EmailService');
/* Create test database if necessary */
beforeAll(async () => {
    server = await app.listen(process.env.PORT_API_TEST || 3001);
});

describe('GET users/confirmation', () => {
    it('Should confirm users email address', async (done) => {
        /* Create new user */
        // EmailService.sendConfirmationEmail = jest.fn(() => null);
        await request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "test@test.com", password: "test12345678") { id } }`)
                .expect(200);

        const { confirmationEmailToken } = await UserService.getUserByEmail('test@test.com'); 
        await request(app)
                .get(`/users/confirmation?confirmation_token=${confirmationEmailToken}`)
                .set('Content-Type', 'application/graphql')
                .expect(200);
        const user = await UserService.getUserByEmail('test@test.com');
        expect(user.emailConfirmed).toBe(true);
        done();
    });

    it('Should throw exception is token is expired', async (done) => {
        // EmailService.sendConfirmationEmail = jest.fn(() => null);
        await request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "test23@test.com", password: "test12345678") { id } }`)
                .expect(200);
                
        /* Set token to expire now */
        let pastDateTime = new Date();
        pastDateTime.setMonth(pastDateTime.getMonth() - 2);
        await UserService.updateUser({ confirmationEmailExpirationDate: pastDateTime }, { email: "test23@test.com" });             
        const { confirmationEmailToken } = await UserService.getUserByEmail('test23@test.com'); 
        await request(app)
                .get(`/users/confirmation?confirmation_token=${confirmationEmailToken}`)
                .set('Content-Type', 'application/graphql')
                .expect(200);
        const user = await UserService.getUserByEmail('test@test.com');
        expect(user.emailConfirmed).toBe(true);
        done();
    });
});

/* Update tests to not use mocks */

afterAll(async () => {
    server.close();
    sequelize.close();
});