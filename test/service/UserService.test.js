const { user } = require('../../models').sequelize.models;
const UserService = require('../../service/UserService');
jest.mock('bcryptjs');
const bcrypt = require('bcryptjs');

describe('UserService', () => {
    let queryResult;

    beforeEach(() => {
        queryResult = { dataValues: { id: 1, email: "test@test.com", password: "test12345" } };
    });

    describe('createUser()', () => {
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

    describe('getUserById()', () => {
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

    describe('getUserByEmailAndPassword', () => {
        it('should return user if valid email password combination', async() => { 
            bcrypt.compare = jest.fn(() => true);
            queryResult.dataValues.password = "HASHEDPASSWORD";
            UserService.getUserByEmail = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.getUserByEmailAndPassword("test@test.com", "test12345");
            expect(bcrypt.compare).toBeCalledWith("test12345", "HASHEDPASSWORD", expect.any(Function));
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
            expect(result.password).toEqual(queryResult.dataValues.password);
        });

        it('should throw invalid password exception', async() => {
            bcrypt.compare = jest.fn(() => false);
            queryResult.dataValues.password = "HASHEDPASSWORD";
            UserService.getUserByEmail = jest.fn().mockResolvedValue(queryResult);
            try {
                const result = await UserService.getUserByEmailAndPassword("test@test.com", "INVALIDPW");
            } catch (e) {
                expect(e).toEqual('Invalid password.');
                expect(bcrypt.compare).toBeCalledWith("INVALIDPW", "HASHEDPASSWORD", expect.any(Function));
            }
        });
    });
});