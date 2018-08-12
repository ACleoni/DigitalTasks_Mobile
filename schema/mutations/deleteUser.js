const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const {
    GraphQLString
} = require('graphql');
const LOGGER = require('../../utils/logger');

module.exports = {
    type: UserType,
    args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
    resolve: async(obj, args, { res }) => {
        try {
            const userInfo = await UserService.createUser(email, password);
            res.clearCookie("token");
            return { email: userInfo.email, id: userInfo.id };
        } catch (e) {
            LOGGER.error("Error occurred in deleteUser resolver", e);
            throw e;
        }
    }
}