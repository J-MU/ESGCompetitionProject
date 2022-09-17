const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const friendDao = require("./friendDao");
const userDao = require("../User/userDao");

// Provider: Read 비즈니스 로직 처리

exports.getFriends = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const friendList = await friendDao.getFriends(connection, userId);
  console.log("왜 안됨?");
  console.log(friendList);
  connection.release();

  return friendList;
};

exports.retrieveUserFriend = async function (friendcode, userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const firstIdList = await friendDao.selectFriendIdList(
    connection,
    friendcode
  );

  console.log(firstIdList);

  const userFriendResult = await friendDao.selectUserFriend(
    connection,
    friendcode,
    userId
  );

  return userFriendResult;
};
