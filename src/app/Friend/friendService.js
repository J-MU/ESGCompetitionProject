const {pool} = require("../../../config/database");
const userDao = require("../User/userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const {logger} = require("../../../config/winston");
const friendDao = require("./friendDao");
const missionDao = require("../Mission/missionDao");


exports.notifyFriendRequest = async function(userId, friendcode) {
    const connection = await pool.getConnection(async (conn) => conn);

    const friendId = await friendDao.selectFriendId(connection, friendcode);

    const userName = await missionDao.selectUserName(connection,userId);

    const message = `${userName}님이 친구 요청을 보냈습니다.`

    const notificationId = await friendDao.insertNotifications(connection,friendId,message);

    const insertNotifications_Of_FriendRequestResult = await friendDao.insertNotifications_Of_FriendRequest(connection,notificationId,userId);

    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.makeNewFriend = async function(userId, notificationId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const friendId = await friendDao.selectFriendIdFromNotification(connection, notificationId);

    const makeUserFriendResult = await friendDao.insertUserFriend(connection, userId, friendId);

    const userName = await missionDao.selectUserName(connection,userId);

    const message = `${userName}님과 이제 친구입니다.`

    const sendRequestAcceptanceMessage = await friendDao.insertNotifications(connection, friendId, message);

    connection.release();

    return response(baseResponse.SUCCESS);
}