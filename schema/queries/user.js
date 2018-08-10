const UserService = require("../../service/UserService");
const { UserType } = require('../types');
const {
    GraphQLInt
} = require('graphql');

module.exports = {
        type: UserType,
        args: { id: { type: GraphQLInt } },
        resolve: async(obj, { id }, { user }) => {
            if (!user) throw Error("Unauthorized request.");
            return await UserService.getUserById(user.id);
        }
    }