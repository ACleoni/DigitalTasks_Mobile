const chai = require('chai');
const expect = chai.expect;
const sequelize = require('sequelize');
const User = require('../../model/User');
const sandbox = sinon.sandbox.create();

describe('User Model', () => {
    let getUserStub;
    let sampleArgs;
    let sampleUser;

    

    beforeEach(() => {
        sampleUser = {
            id: 123,
            email: "test@test.com",
            password: "123"
        }

        getUserStub = sandbox.stub(sequelize.Model, 'getUserByEmail').resolves(sampleUser);
    })

    describe('getUserByEmail', () => {
        it('should check for an email address', () => {
            User.create({

            });
        });
    });
});