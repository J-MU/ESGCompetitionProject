const jwtMiddleware = require("../../../config/jwtMiddleware");
const friendProvider = require("./friendProvider");
const friendService = require("./friendService");
const userController = require("../User/userController");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const userProvider = require("../User/userProvider");
const userService = require("../User/userService");

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users

 */
exports.getFriends = async function (req, res) {
  /**
   *   path variables: userId:
   **/
  /* userId가 유효한 값인지*/
  const userId = req.params.userId;
  // user Validation
  if (!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));

  if (await userController.checkUserIdRange(userId))
    return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

  if (isNaN(userId))
    return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

  const friendList = await friendProvider.getFriends(userId);

  return res.send(response(baseResponse.SUCCESS, friendList));
};

exports.getUserFriend = async function (req, res) {
  const friendcode = req.params.friendUniqueCode;
  const userId = req.params.userId;

  console.log("Get User Friend 친구검색 할끄야~!!~");
  console.log("Get User Friend 친구검색 할끄야~!!~");
  console.log("Get User Friend 친구검색 할끄야~!!~");
  console.log("Get User Friend 친구검색 할끄야~!!~");
  console.log(friendcode);
  console.log(userId);
  const userFriendResponse = await friendProvider.retrieveUserFriend(
    friendcode,
    userId
  );

  return res.send(response(baseResponse.SUCCESS, userFriendResponse));
};

exports.postFriendRequestNotification = async function (req, res) {
  const userId = req.body.userId; // 친구 요청을 보내는 사람
  const friendcode = req.body.friendcode; //친구의 코드
  console.log("친구요청이 들어왔어연~");
  const postFriendRequestNotificationResponse =
    await friendService.notifyFriendRequest(userId, friendcode);

  return res.send(postFriendRequestNotificationResponse);
};

exports.postNewFriend = async function (req, res) {
  console.log("여기 들어는 왔냐~?");
  const userId = req.body.userId; //친구 요청 받은 사람
  const notificationId = req.body.notificationId; //알림 Id

  const postNewFriendResponse = await friendService.makeNewFriend(
    userId,
    notificationId
  );

  return res.send(postNewFriendResponse);
};
