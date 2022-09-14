const user = require("../User/userController");
module.exports = function(app){
    const friend = require('./friendController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/users/:userId/friends', friend.getFriends);

    // 친구 검색 API
    app.get('/app/friends/:friendUniqueCode', friend.getUserFriend);

    // 친구 추가 알림 보내기
    app.post('/app/user/friendRequest', friend.postFriendRequestNotification);

    // 친구 추가 API
    app.post('/app/friends/:userUniqueCode', friend.postUserFriend);
};

