const mission = require("./missionController");
module.exports = function(app) {
    const mission = require('./missionController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //my미션 리스트 화면 get

    app.get('/app/MyMissionLists/:userId', mission.getMyMissionLists);

    //모든 미션 리스트 화면 get

    app.get('/app/missionLists', mission.getMissionLists);

    //my미션 생성
    app.post('/app/MyMission/:missionId', mission.postMission);

    //my미션 이름 수정
    app.patch('/app/MyMission/missionName', mission.patchMissionName);

    //my미션 친구 추가
    app.post('/app/missionWithFriend' , mission.postFriendInMission);

};
