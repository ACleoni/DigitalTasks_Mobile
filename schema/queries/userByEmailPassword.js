const UserService = require("../../service/UserService");
const { UserType } = require('../types');
const {
    GraphQLInt,
    GraphQLString
} = require('graphql');
const LOGGER = require('../../utils/logger');

module.exports = {
        type: UserType,
        args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
        resolve: async(obj, { email, password }, { res }) => {
            try {
                const { id, token, userEmail } = await UserService.getUserTokenByEmailAndPassword(email, password);
                res.cookie("token", token);
                return { id, email: userEmail };
            } catch (e) {
                throw e;
            }
        }
    }