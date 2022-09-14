const {pool} = require("../../../config/database");
const userDao = require("../User/userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const {logger} = require("../../../config/winston");
const friendDao = require("./friendDao");
const missionDao = require("../Mission/missionDao");


exports.makeUserFriend = async function (usercode,userId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {

        const friendId = await friendDao.selectFriendId(connection, usercode);

        const makeUserFriendResult = await friendDao.insertUserFriend(connection, friendId,userId);

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {

        connection.release();
    }

}

exports.notifyFriendRequest = async function(userId, friendcode) {
    const connection = await pool.getConnection(async (conn) => conn);

    const friendId = await friendDao.selectFriendId(connection, friendcode);

    const userName = await missionDao.selectUserName(connection,userId);

    const message = `${userName}님이 친구 요청을 보냈습니다.`

    const notificationId = await friendDao.insertNotifications(connection,friendId,message);

    const insertNotifications_Of_FriendRequestResult = await friendDao.insertNotifications_Of_FriendRequest(connection,notificationId,userId);

    return response(baseResponse.SUCCESS);
}