describe('User Model', () => {
    let sampleUser;
    let models;

    /* Create test database if necessary */
    beforeAll(async () => {
        await require('../util/setup')();
        models = require('../../models').sequelize.models;
    });

    beforeEach(() => {
        sampleUser = {
            id: 123,
            email: "test@test.com",
            password: "123456789"
        }
    });

    describe('User.create()', () => {
        it('should successfully create a new user', async () => {
            const user = await models.user.create({ email: sampleUser.email, password: sampleUser.password });
            expect(user.dataValues.email).toBe(sampleUser.email);
        });

        it('should hash password before creating user record', async () => {
            const user = await models.user.create({ email: sampleUser.email, password: sampleUser.password })
                                          .catch((e) => new Error(e));

            expect(user.dataValues.password.slice(0, 6)).toBe('$2a$10');
        });

        it('should throw an exception if password is less than 5 characters in length', () => {
            return  models.user.create({ email: sampleUser.email, password: "1" })
                               .then(() => expect.fail('Created user', 'Expected exception'))
                               .catch((e) => expect(e.toString()).toBe("SequelizeValidationError: Validation error: Password must be atleast 5 characters"));

        });

        it('should throw an exception if invalid email format', () => {
            return models.user.create({ email: "invalid email", password: sampleUser.password })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.errors[0].message).toBe("Please enter a valid email address"));
        });

        it('should throw password cannot be blank exception', () => {
            return models.user.create({ email: sampleUser.email })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.toString()).toBe("SequelizeValidationError: notNull Violation: user.password cannot be null"));
        });

        it('should throw email cannot be blank exception', () => {
            return models.user.create({ password: sampleUser.password })
                              .then(() => expect.fail('Created user', 'Expected exception'))
                              .catch(e => {
                                  expect(e.toString()).toBe("SequelizeValidationError: notNull Violation: user.email cannot be null");
                                });
        });
    });

    /* Clear all rows in database */
    afterEach(async function() {
        return models.user.destroy({
            where: { }
        })
        .then(() => { })
        .catch((e) => console.log(e))
    });
});