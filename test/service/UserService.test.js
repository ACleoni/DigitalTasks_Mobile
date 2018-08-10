const { user } = require('../../models').sequelize.models;
const UserService = require('../../service/UserService');
const sequelize = require('sequelize');

describe('UserService', () => {
    let queryResult;

    beforeEach(() => {
        queryResult = { dataValues: { id: 1, email: "test@test.com" } };
    });

    describe('createUser()', () => {
        it('should return user id and email without an exception', async () => {
            user.create = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.createUser("test@test.com", "12345678");
            expect(user.create).toBeCalled();
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
        });

        it('should throw an exception if password is less than 5 characters', () => {
            expect(UserService.createUser("test@test.com", "123")).rejects.toBe("Password must be atleast 5 characters.");
        });

        it('should throw an exception if email is blank.', () => {
            expect(UserService.createUser("", "1234567")).rejects.toBe("Email cannot be blank.");
        });
    });

    describe('getUserById()', () => {
        it('should return user record without an exception', async () => {
            user.findOne = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.getUserById(1);
            expect(user.findOne).toBeCalled();
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
        });

        it('should throw a user does not exist exception', async () => {
            user.findOne = jest.fn().mockResolvedValue(null);
            try {
                await UserService.getUserById("INVALID ID");
                fail("Exception not thrown.");
            } catch (e) {
                expect(e).toBeDefined();
            }
        })
    })
});