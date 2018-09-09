const UserService = require('../../service/UserService');
const { UserType } = require('../types');
const LOGGER = require('../../utils/logger');

module.exports = {
    type: UserType,
    resolve: async(obj, args, { req, res }) => {
        try {
            if (!user) {
                LOGGER.error("Unauthorized Request");
                throw Error("Unauthorized request.");
            }
            const userInfo = await UserService.deleteUserById(req.user.id);
            res.clearCookie("token");
            return { email: userInfo.email };
        } catch (e) {
            LOGGER.error("Error occurred in deleteUser resolver", e);
            throw e;
        }
    }
}