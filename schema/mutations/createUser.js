const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const {
    GraphQLString
} = require('graphql');
const LOGGER = require('winston');

module.exports = {
    type: UserType,
    args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
    resolve: async(obj, { email, password }, { res }) => {
        try {
            const userInfo = await UserService.createUser(email, password);
            res.cookie("token", userInfo.token);
            return { email: userInfo.email, id: userInfo.id };
        } catch (e) {
            LOGGER.error("Error occurred in createUser resolver", e);
            throw e;
        }
    }
}