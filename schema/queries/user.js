const UserService = require("../../service/UserService");
const { UserType } = require('../types');
const {
    GraphQLString
} = require('graphql');

module.exports = (() => {
    return {
        type: UserType,
        args: { email: { type: GraphQLString } },
        resolve: async(obj, { email }, { res, next }) => {
            const userRecord = await UserService.getUserByEmail(email);
            if (userRecord) {
                return userRecord;
            }
        }
    }
})();