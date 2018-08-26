const request = require('supertest');
const url = require('../../config/config').base.url;
const EmailService = require('../../service/EmailService');
const sequelize = require('../../models').sequelize;
const cookieParser = require('cookie-parser');
const app = require('../../app');
let server;
jest.mock('../../service/EmailService');
/* Create test database if necessary */
beforeAll(async () => {
    server = await app.listen(process.env.PORT || 3001);
});

describe('User Schema', () => {
    describe('User Mutations', () => {
        describe('Create User', () => {
            let userToken;
            it('Should create a user record and return JWT', (done) => {
                /* Mock sendEmail function */
                EmailService.sendConfirmationEmail = jest.fn(() => null);
                     request(app)
                       .post('/graphql')
                       .set('Content-Type', 'application/graphql')
                       .send(`mutation { createUser(email: "test@test.com", password: "test12345678") { id } }`)
                       .expect(200)
                       .end(((err, res) => {
                           if (err) fail(err);
                           /* Expect confirmation email to be sent */
                           expect(EmailService.sendConfirmationEmail).toBeCalledWith('test@test.com', expect.anything());
                           /* Expect response to return valid user id */
                           expect(res.body).toMatchObject({ data: { createUser: { id: 1 } } });
                           /* Expect response to contain JWT */
                           expect(res.headers['set-cookie'][0]).toMatch(/token=.+/);
                           userToken = res.headers['set-cookie'][0];
                           done();
                        }));
            });

            it('Should return error when creating user with invalid password length', (done) => {
                request(app)
                       .post('/graphql')
                       .set('Content-Type', 'application/graphql')
                       .send(`mutation { createUser(email: "invalidPassword@test.com", password: "test1") { id } }`)
                       .expect(200)
                       .end(((err, res) => {
                           if (err) fail(err);
                           done();
                        }));
            });
        });
    });
});

afterAll(() => {
    server.close();
    sequelize.close();
});

const expectedResponse = (res) => {

}
       
