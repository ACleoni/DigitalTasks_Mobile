const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const {
    GraphQLString
} = require('graphql');

module.exports = {
    type: UserType,
    args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
    resolve: async(obj, { email, password }, { res }) => {
        try {
            const userInfo = await UserService.createUser(email, password);
            res.cookie("token", userInfo.token);
            return { email: userInfo.email, id: userInfo.id };
        } catch (e) {
            throw e;
        }
    }
}