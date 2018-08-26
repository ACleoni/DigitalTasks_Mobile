describe('User Model', () => {
    let sampleUser;
    let models;

    /* Create test database if necessary */
    beforeAll(async () => {
        models = require('../../models').sequelize.models;
        await models.user.destroy({ where: { } });
    });
    

    beforeEach(() => {
        sampleUser = {
            email: "test@test.com",
            password: "123456789",
            confirmationEmailToken: "1234567"
        }
    });

    describe('User.create()', () => {
        it('should successfully create a new user', async () => {
            const user = await models.user.create(sampleUser);
            expect(user.dataValues.email).toBe(sampleUser.email);
        });

        it('should hash password before creating user record', async () => {
            const user = await models.user.create(sampleUser)
                                          .catch((e) => new Error(e));

            expect(user.dataValues.password.slice(0, 6)).toBe('$2a$10');
        });

        it('should throw an exception if password is less than 5 characters in length', () => {
            sampleUser.password = "1";
            return  models.user.create(sampleUser)
                               .then(() => fail('Created user', 'Expected exception'))
                               .catch((e) => expect(e.toString()).toBe("SequelizeValidationError: Validation error: Password must be atleast 5 characters"));
        });

        it('should throw an exception if invalid email format', () => {
            sampleUser.email = "invalid email";
            return models.user.create(sampleUser)
                              .then(() => fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.errors[0].message).toBe("Please enter a valid email address"));
        });

        it('should throw password cannot be blank exception', () => {
            sampleUser.password = "";
            return models.user.create(sampleUser)
                              .then(() => fail('Created user', 'Expected exception'))
                              .catch(e => expect(e.toString()).toBe("SequelizeValidationError: Validation error: Password must be atleast 5 characters"));
        });

        it('should throw email cannot be blank exception', () => {
            sampleUser.email = "";
            return models.user.create(sampleUser)
                              .then(() => fail('Created user', 'Expected exception'))
                              .catch(e => {
                                  expect(e.toString()).toBe("SequelizeValidationError: Validation error: Please enter a valid email address");
                                });
        });

        it('should set default confirmation exp to Date() plus config settings', async () => {
            const user = await models.user.create(sampleUser);
            expect(user.dataValues.confirmationEmailExpirationDate).toBeDefined();
            expect(user.dataValues.confirmationEmailExpirationDate).not.toBeNull();
        });

        it('should set email confirmation to false by default', async () => {
            const user = await models.user.create(sampleUser);
            expect(user.dataValues.emailConfirmed).toBe(false);
        });
    });

    /* Clear all rows in database */
    afterEach(async function() {
        return models.user.destroy({
            where: { }
        })
        .catch((e) => console.log(e))
    });
});