const { user } = require('../../models').sequelize.models;
const UserService = require('../../service/UserService');

describe('UserService', () => {
    let queryResult;
    let res;

    beforeEach(() => {
        queryResult = { dataValues: { id: 1, email: "test@test.com" } };
        res = { };
        res.cookie = jest.fn();
    });

    describe('createUser()', () => {
        it('should call user.create() without an exception', async () => {
            user.create = jest.fn().mockResolvedValue(queryResult);
            const result = await UserService.createUser("test@test.com", "12345678");
            expect(user.create).toBeCalled();
            expect(result.email).toEqual(queryResult.dataValues.email);
            expect(result.id).toEqual(queryResult.dataValues.id);
        });

        it('should throw an exception if password is less than 5 characters', () => {
            expect(UserService.createUser("test@test.com", "123")).rejects.toThrowError(/Password must be atleast \d* characters./);
        });

        it('should throw an exception if email is blank.', () => {
            expect(UserService.createUser("", "1234567", res)).rejects.toThrowError(/Email cannot be blank./);
        });
    });
});