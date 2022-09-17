const user = require("../User/userController");
module.exports = function (app) {
  const friend = require("./friendController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/app/users/:userId/friends", friend.getFriends);

  // 친구 검색 API
  app.get("/app/users/:userId/friends/:friendUniqueCode", friend.getUserFriend);

  // 친구 추가 알림 보내기
  app.post("/app/user/friendRequest", friend.postFriendRequestNotification);

  // 알림에서 승인 눌러서 친구 추가
  app.post("/app/friendAcceptance", friend.postNewFriend);
};
