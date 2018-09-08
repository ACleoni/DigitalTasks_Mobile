const request = require('supertest');
const sequelize = require('../../../models').sequelize;
const UserService = require('../../../service/UserService');
const { inboxId, token } = require('../../../config/secretKey').mailtrap;
const app = require('../../../app');
let server;

/* Create test database if necessary */
beforeAll(async () => {
    server = await app.listen(process.env.PORT_API_TEST || 3001);
});

describe('GET users/confirmation', () => {
    it('Should confirm users email address', async (done) => {
        let userEmail = `test123@test123.com`;
        /* Create new user */
        await request(server)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "${userEmail}", password: "test12345678") { id } }`)
                .expect(200);

        const { confirmationEmailToken } = await UserService.getUserByEmail(userEmail); 
        await request(server)
                .get(`/users/confirmation?confirmation_token=${confirmationEmailToken}`)
                .set('Content-Type', 'application/graphql')
                .expect(200);
        const user = await UserService.getUserByEmail(userEmail);
        expect(user.emailConfirmed).toBe(true);

        done();
    });

    it('Should throw exception is token is expired', async (done) => {
        await request(server)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "test23@test.com", password: "test12345678") { id } }`)
                .expect(200);
    
        let pastDateTime = new Date();
        pastDateTime.setMonth(pastDateTime.getMonth() - 2);
        await UserService.updateUser({ confirmationEmailExpirationDate: pastDateTime }, { email: "test23@test.com" });             
        const { confirmationEmailToken } = await UserService.getUserByEmail('test23@test.com'); 

        await request(server)
                .get('/users/confirmation?confirmation_token=' + confirmationEmailToken)
                .expect(401);

        const user = await UserService.getUserByEmail('test23@test.com');
        expect(user.emailConfirmed).toBe(false);
        done();
    });
});

afterAll(async () => {
    /* Clear inbox */
    await request(`https://mailtrap.io`)
                .patch(`/api/v1/inboxes/${inboxId}/clean`)
                .set('Api-Token', token)
                .send();
    await server.close();
    await sequelize.close();
});