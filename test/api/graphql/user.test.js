const request = require('supertest');
const EmailService = require('../../../service/EmailService');
const sequelize = require('../../../models').sequelize;
const app = require('../../../app');
let server;
jest.mock('../../../service/EmailService');
/* Create test database if necessary */
beforeAll(async () => {
    server = await app.listen(process.env.PORT_API_TEST || 3001);
});

describe('User', () => {
    let userToken;
    describe('Create User', () => {
        
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
                    done();
                }));
        });
    
        it('Should return error when creating user with invalid password length', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "invalidPassword@test.com", password: "test") { id } }`)
                .expect(200)
                .end(((err, res) => {
                    expect(res.body).toMatchObject({"errors":[{"message":"Password must be atleast 5 characters"}],"data":{"createUser":null}});
                    done();
                }));
        });
    
        it('Should return error when creating user with invalid email', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "invalidEmail", password: "test12321312") { id } }`)
                .expect(200)
                .end(((err, res) => {
                    expect(res.body).toMatchObject({"errors":[{"message":"Email format is invalid."}],"data":{"createUser":null}});
                    done();
                }));
        });
    
        it('Should return error when creating user with invalid email', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "invalidEmail", password: "test12321312") { id } }`)
                .expect(200)
                .end(((err, res) => {
                    expect(res.body).toMatchObject({"errors":[{"message":"Email format is invalid."}],"data":{"createUser":null}});
                    done();
                }));
        });
    
        it('Should return error when creating user with blank email', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "", password: "test12321312") { id } }`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toMatchObject({"errors":[{"message":"Email cannot be blank."}],"data":{"createUser":null}});
                    done();
                });
        });
    });

    describe('User login', () => {

        it('Should return valid JWT when user logs in with valid email / password', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`query { userByEmailPassword(email: "test@test.com", password: "test12345678") { id } }`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toMatchObject({ data: { userByEmailPassword: { id: 1 } } });
                    expect(res.headers['set-cookie'][0]).toMatch(/token=.+/);
                    userToken = res.headers['set-cookie'][0];
                    done();
                });
            });
    });
});

afterAll(() => {
    server.close();
    sequelize.close();
});


       
