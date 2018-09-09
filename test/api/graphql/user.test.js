const request = require('supertest');
const EmailService = require('../../../service/EmailService');
const sequelize = require('../../../models').sequelize;
const { inboxId, token } = require('../../../config/secretKey').mailtrap;
const app = require('../../../app');
jest.mock('../../../service/EmailService');

beforeAll(() => {
    if (app.settings.env !== 'test') throw 'Application not runnning in test mode'
});

describe('User', () => {
    describe('Create User', () => {
        it('Should create a user record and return JWT', (done) => {
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
                    expect(res.body).toMatchObject({ data: { createUser: {  } } });
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
                    expect(res.body).toMatchObject({ data: { userByEmailPassword: {  } } });
                    expect(res.headers['set-cookie'][0]).toMatch(/token=.+/);
                    userToken = res.headers['set-cookie'][0];
                    done();
                });
            });
          
        it('Should not return JWT when using invalid password', (done) => {
            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`query { userByEmailPassword(email: "test@test.com", password: "INVALIDPASSWORD") { id } }`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.errors[0].message).toBe('Invalid password.');
                    expect(res.headers['set-cookie']).toBeUndefined();
                    done();
                });
            });
        });

    describe('Delete User', () => {
        it('Should delete user if valid id', async (done) => {
            let token;

            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "testzzzzzz@test.com", password: "test12345678") { id } }`)
                .expect(200)
                .end(((err, res) => {
                    if (err) fail(err);
                    token = res.headers['set-cookie'][0];
                    request(app)
                        .post('/graphql')
                        .set('Content-Type', 'application/graphql')
                        .set('Cookie', [ token ] )
                        .send(`mutation { deleteUser }`)
                        .expect(200)
                        .end(((err, res) => {
                            if (err) fail(err);
                            expect(res.body.data.deleteUser).toBe(true);
                            done();
                        }));
                    }));
                });
            });

        it('Should return unauthorized request if using invalid id', async (done) => {
            let token;

            request(app)
                .post('/graphql')
                .set('Content-Type', 'application/graphql')
                .send(`mutation { createUser(email: "test222zzzzzz@test.com", password: "test12345678") { id } }`)
                .expect(200)
                .end(((err, res) => {
                    if (err) fail(err);
                    token = res.headers['set-cookie'][0];
                    request(app)
                        .post('/graphql')
                        .set('Content-Type', 'application/graphql')
                        .send(`mutation { deleteUser }`)
                        .expect(200)
                        .end(((err, res) => {
                            if (err) fail(err);
                            expect(res.body.errors[0].message).toBe('Unauthorized request.');
                            done();
                        }));
                    }));
                });
        });

afterAll(async () => {
    /* Clear inbox */
    await request(`https://mailtrap.io`)
                .patch(`/api/v1/inboxes/${inboxId}/clean`)
                .set('Api-Token', token)
                .send();
    await sequelize.close();            
});  

       
