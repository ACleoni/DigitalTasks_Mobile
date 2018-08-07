const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const {
    GraphQLString
} = require('graphql');

module.exports = (() => {
    return {
        type: UserType,
        args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
        resolve: async(obj, { email, password }, context) => {
            try {
                const userInfo = await UserService.createUser(email, password);
                context.res.cookie("token", userInfo.token);
            } catch (e) {
                context.res.status(400).end(e);
            }
            return { email: userInfo.email, id: userInfo.id };
        }
    }
})();