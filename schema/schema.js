const UserService = require('../service/UserService');

const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (obj) => obj.id
        },
        email: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (obj) => obj.email
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { email: { type: GraphQLString } },
            resolve: (obj, { email }) => UserService.getUserByEmail(email)
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
            resolve: (obj, { email, password }) => UserService.createUser(email, password)
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});  