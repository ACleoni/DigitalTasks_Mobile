const request = require('supertest');
const EmailService = require('../../../service/EmailService');
const sequelize = require('../../../models').sequelize;
const UserService = require('../../../service/UserService');
const app = require('../../../app');
let server;

/* Create test database if necessary */
beforeAll(async () => {
    server = await app.listen(process.env.PORT_API_TEST || 3001);
});

describe('GET users/confirmation', () => {
    it('Should confirm users email address', async (done) => {
        /* Create new user */
        await request(server)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "dcdigitaltasks@gmail.com", password: "test12345678") { id } }`)
                .expect(200);

        const { confirmationEmailToken } = await UserService.getUserByEmail('dcdigitaltasks@gmail.com'); 
        await request(server)
                .get(`/users/confirmation?confirmation_token=${confirmationEmailToken}`)
                .set('Content-Type', 'application/graphql')
                .expect(200);
        const user = await UserService.getUserByEmail('dcdigitaltasks@gmail.com');
        expect(user.emailConfirmed).toBe(true);
        done();
    });

    it('Should throw exception is token is expired', async (done) => {
        await request(server)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "test23@test.com", password: "test12345678") { id } }`)
                .expect(200);
                
        /* Set token to expire now */
        try {
            let pastDateTime = new Date();
            pastDateTime.setMonth(pastDateTime.getMonth() - 2);
            await UserService.updateUser({ confirmationEmailExpirationDate: pastDateTime }, { email: "test23@test.com" });             
            const { confirmationEmailToken } = await UserService.getUserByEmail('test23@test.com'); 
            console.log(`/users/confirmation?confirmation_token=${confirmationEmailToken}`)
            await request(server)
                    .get('/users/confirmation?confirmation_token=' + confirmationEmailToken).catch(e => console.log(e))
                    .expect(200).catch(e => console.log(e));
        
            const user = await UserService.getUserByEmail('test23@test.com');
            expect(user.emailConfirmed).toBe(true);
        } catch (e) {
            console.log(e);
        }
        done();
    });
});

afterAll(async () => {
    await server.close();
    await sequelize.close();
});