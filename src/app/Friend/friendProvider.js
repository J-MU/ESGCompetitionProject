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

exports.retrieveUserFriend = async function (friendcode, userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  console.log("여기가 중요");
  const firstIdList = await friendDao.selectFriendIdList(
    connection,
    friendcode
  );

  console.log("뭐가 찍히나?");
  console.log(firstIdList);

  let userFriendResult;

  for(i=0; i<firstIdList.length; i++){
    userFriendResult = await friendDao.selectUserFriend(
      connection,
      friendcode,
      firstIdList[i].userId,
      userId
    );  
  }
  
  
  return userFriendResult;
};
