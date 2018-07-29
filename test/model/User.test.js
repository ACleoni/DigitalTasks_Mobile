const chai = require('chai');
const expect = chai.expect;
const sequelize = require('sequelize');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = "test";
const { models } = require('../../models').sequelize;


describe('User Model', function() {
    let sampleUser;

    beforeEach(function() {
        sampleUser = {
            id: 123,
            email: "test@test.com",
            password: "123456789"
        }
    });

    describe('User.create()', function() {
        it('should successfully create a new user', async function() {
            const user = await models.user.create({ email: sampleUser.email, password: sampleUser.password });
            expect(user.dataValues.email).to.equal(sampleUser.email);
        });

        it('should hash password before creating user record', async function() {
            const user = await models.user.create({ email: sampleUser.email, password: sampleUser.password })
                                          .catch((e) => new Error(e));

            expect(user.dataValues.password.slice(0, 6)).to.equal('$2a$10');
        });

        it('should throw an exception if password is less than 7 characters in length', async function() {
            const user = await models.user.create({ email: sampleUser.email, password: "1" })
                                          .then(() => expect.fail('Created user', 'Expected exception'))
                                          .catch((e) => expect(e.toString()).to.equal("SequelizeValidationError: Validation error: Password must be atleast 7 characters"));

        });

        it('should throw an exception if invalid email format', function() {
            return models.user.create({ email: "invalid email", password: sampleUser.password })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.errors[0].message).to.equal("Please enter a valid email address"));
        });

        it('should throw password cannot be blank exception', function() {
            return models.user.create({ email: sampleUser.email })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.toString()).to.equal("SequelizeValidationError: notNull Violation: user.password cannot be null"));
        });

        it('should throw email cannot be blank exception', function() {
            return models.user.create({ password: sampleUser.password })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => {
                                  expect(e.toString()).to.equal("SequelizeValidationError: notNull Violation: user.email cannot be null");
                                });
        });
    });

    afterEach(async function() {
        return models.user.destroy({
            where: { }
        })
        .then(() => { })
        .catch((e) => console.log(e))
    });
});