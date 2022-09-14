const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const friendDao = require("./friendDao");
const userDao = require("../User/userDao");

// Provider: Read 비즈니스 로직 처리

exports.getFriends = async function (userId) {
    
    const connection = await pool.getConnection(async (conn) => conn);
    const friendList = await friendDao.getFriends(connection, userId);
    connection.release();

    return friendList;

};

exports.retrieveUserFriend = async function(friendcode) {

    const connection = await pool.getConnection(async (conn) => conn);

    const userFriendResult = await friendDao.selectUserFriend(connection, friendcode);

    return userFriendResult;

}


