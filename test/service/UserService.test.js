const { user } = require('../../models').sequelize.models;
const UserService = require('../../service/UserService');
const bcrypt = require('bcryptjs');

describe('UserService', () => {
    let queryResult;

    beforeEach(() => {
        let date = new Date();
        queryResult = { dataValues: 
            { 
                id: 1, 
                email: "test@test.com", 
                password: "test12345", 
                confirmationEmailToken: "123",
                confirmationEmailExpirationDate: date.setMonth(date.getMonth() + 3)
            } 
        };
    });

    describe('createUser', () => {
        it('should return user id and email without an exception', async () => {
            user.create = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.createUser("test@test.com", "12345678").catch(e => fail(e));
            expect(user.create).toBeCalled();
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
        });

        it('should throw an exception if password is less than 5 characters', async() => {
            try {
                await UserService.createUser("test@test.com", "123");
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toEqual("Password must be atleast 5 characters.");
            }
        });

        it('should throw an exception if email is blank.', () => {
            try {
                expect(UserService.createUser("", "1234567")).rejects.toBe("Email cannot be blank.");
            } catch (e) {
                expect(e).toBeDefined();
            }
        });
    });

    describe('getUserById', () => {
        it('should return user record without an exception', async () => {
            user.findById = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.getUserById(1).catch(e => fail(e));
            expect(user.findById).toBeCalledWith(1);
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
        });

        it('should throw a user does not exist exception', async () => {
            user.findById = jest.fn().mockResolvedValue(null);
            try {
                await UserService.getUserById("INVALID ID");
                fail("Exception not thrown.");
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toEqual('User does not exist.');
            }
        });
    });

    describe('getUserByEmail', () => {
        it('should return user if valid email address', async() => {
            user.findOne = jest.fn().mockResolvedValue(queryResult.dataValues);
            await UserService.getUserByEmail("test@test.com").catch(e => fail(e));
            expect(user.findOne).toBeCalledWith(expect.objectContaining({
                where: {
                    email: "test@test.com"
                }
            }));
        });

        it('should throw an exception if user is null', async() => {
            user.findOne = jest.fn().mockResolvedValue(null);
            try {
                await UserService.getUserByEmail("INVALID EMAIL");
                fail("Exception not thrown.");
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toEqual('User does not exist.');
            }
        });
    });

    describe('getUserTokenByEmailAndPassword', () => {
        it('should return user id, email, and token if valid email password combination', async() => { 
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            queryResult.dataValues.password = "HASHEDPASSWORD";
            UserService.getUserByEmail = jest.fn().mockResolvedValue(queryResult.dataValues);
            const result = await UserService.getUserTokenByEmailAndPassword("test@test.com", "test12345");
            expect(bcrypt.compare).toBeCalledWith("test12345", "HASHEDPASSWORD");
            expect(result.userEmail).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
            expect(result.token).toBeDefined();
        });

        it('should throw invalid password exception', async () => {
            bcrypt.compare = jest.fn().mockResolvedValue(false);
            queryResult.dataValues.password = "HASHEDPASSWORD";
            UserService.getUserByEmail = jest.fn().mockResolvedValue(queryResult.dataValues);
            try {
                await UserService.getUserTokenByEmailAndPassword("test@test.com", "INVALIDPW");
            } catch (e) {
                expect(e).toEqual('Invalid password.');
                expect(bcrypt.compare).toBeCalledWith("INVALIDPW", "HASHEDPASSWORD");
            }
        });
    });

    describe('updateConfirmationToken', () => {
        it('should update confirmation email token expiration date', async () => {
            user.update = jest.fn().mockResolvedValue([1]);
            try {
                const result = await UserService.updateEmailConfirmationToken("test@test.com");
                expect(result).toEqual(1);
            } catch (e) {
                fail(e);
            }
        });

        it('should throw exception when email does not exist in database', async () => {
            user.update = jest.fn().mockResolvedValue([0]);
            try {
                await UserService.updateEmailConfirmationToken("INVALIDEMAIL");
            } catch (e) {
                expect(e).toEqual("Unable to update confirmation token by user email.");
            }
        });
    });

    describe('confirmEmailAddress', () => {
        it('should confirm email address', async () => {
            user.findOne = jest.fn().mockResolvedValue(queryResult);
            UserService.updateUser = jest.fn(() => [[1]]);
            await UserService.confirmEmailAddress(queryResult.dataValues.confirmationEmailToken);
            expect(UserService.updateUser).toBeCalledWith({ emailConfirmed: true}, { confirmationEmailToken: queryResult.dataValues.confirmationEmailToken });
        });

        it('should throw an exception if token is expired', async () => {
            try {
                queryResult.dataValues.confirmationEmailExpirationDate = new Date().setFullYear(1999);
                user.findOne = jest.fn().mockResolvedValue(queryResult);
                await UserService.confirmEmailAddress(queryResult.dataValues.confirmationEmailToken);
                fail(Error('Should have thrown expired token exception'));
            } catch (e) {
                expect(e).toContain('Token expired');
            } 
        });

        it('should throw an exception if invalid token', async () => {
            try {
                user.findOne = jest.fn().mockResolvedValue(null);
                await UserService.confirmEmailAddress(queryResult.dataValues.confirmationEmailToken);
                fail(Error('Should have thrown invalid token exception'));
            } catch (e) {
                expect(e).toContain('Invalid Token');
            } 
        });

        it('should not call updateUser if email address is already confirmed', async () => {
            queryResult.dataValues.emailConfirmed = true;
            user.findOne = jest.fn().mockResolvedValue(queryResult);
            await UserService.confirmEmailAddress(queryResult.dataValues.confirmationEmailToken);
            expect(UserService.updateUser).not.toBeCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete user record', async () => {
            user.findById = jest.fn().mockResolvedValue(queryResult);
            user.destroy = jest.fn().mockResolvedValue(null);
            await UserService.deleteUserById(queryResult.dataValues.id);
            expect(user.destroy).toBeCalledWith({ where: { id: queryResult.dataValues.id } });
        });

        it('should throw exception if invalid user id', async () => {
            try {
                user.findById = jest.fn().mockResolvedValue(null);
                await UserService.deleteUserById(queryResult.dataValues.id);
                fail(Error('Should throw user does not exist exception.'));
            } catch (e) {
                expect(e).toContain('User does not exist.');
            }
        });
    });
});

// async deleteUserById(id) {
//     try {
//         const userRecord = await user.findById(id);
//         if (userRecord === null) throw "User does not exist.";
//         await userRecord.destroy();
//     } catch (e) {
//         LOGGER.error(`An error occured while deleting user record: ${e}`);
//         throw errorFormatter(e);
//     }
// }