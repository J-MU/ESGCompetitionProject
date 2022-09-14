const {pool} = require("../../../config/database");
const userDao = require("../User/userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const {logger} = require("../../../config/winston");
const friendDao = require("./friendDao");
const missionDao = require("../Mission/missionDao");


exports.notifyFriendRequest = async function(userId, friendcode) {
    const connection = await pool.getConnection(async (conn) => conn);

    const friendId = await friendDao.selectFriendId(connection, friendcode); //친구의 Id 가져오기

    const userName = await missionDao.selectUserName(connection,userId); // 내 이름 가져오기

    const message = `${userName}님이 친구 요청을 보냈습니다.`

    const notificationId = await friendDao.insertNotifications(connection,friendId,message); //친구한테 친구 요청 알림보내기

    const insertNotifications_Of_FriendRequestResult = await friendDao.insertNotifications_Of_FriendRequest(connection,notificationId,userId);

    connection.release();
    return response(baseResponse.SUCCESS);
}

exports.makeNewFriend = async function(userId, notificationId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const friendId = await friendDao.selectFriendIdFromNotification(connection, notificationId);//친구요청 보낸 사람 Id 가져오기

    const makeUserFriendResult = await friendDao.insertUserFriend(connection, userId, friendId); //친구 추가하기

    const userName = await missionDao.selectUserName(connection,userId);

    const message = `${userName}님과 이제 친구입니다.`

    const sendRequestAcceptanceMessage = await friendDao.insertNotifications(connection, friendId, message); //친구 추가했다고 메시지 보내기

    connection.release();

    return response(baseResponse.SUCCESS);
}