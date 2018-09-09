const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const {
    GraphQLBoolean
} = require('graphql');
const LOGGER = require('../../utils/logger');

module.exports = {
    type: GraphQLBoolean,
    resolve: async(obj, args, { user, res }) => {
        try {
            if (!user) {
                LOGGER.error("Unauthorized Request");
                throw Error("Unauthorized request.");
            }
            await UserService.deleteUserById(user.id);
            res.clearCookie("token");
            return true;
        } catch (e) {
            LOGGER.error("Error occurred in deleteUser resolver", e);
            throw e;
        }
    }
}