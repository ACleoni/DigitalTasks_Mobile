const UserService = require("../../service/UserService");
const { UserType } = require('../types');
const {
    GraphQLInt
} = require('graphql');
const LOGGER = require('../../utils/logger');

module.exports = {
        type: UserType,
        resolve: async(obj, args, { user }) => {
            console.log(user);
            if (!user) {
                LOGGER.error("Unauthorized Request");
                throw Error("Unauthorized request.");
            }
            return await UserService.getUserById(user.id);
        }
    }