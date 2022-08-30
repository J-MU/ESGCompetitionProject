const mission = require("./missionController");
module.exports = function(app) {
    const mission = require('./missionController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //my미션 리스트 화면 get
    /**
     * @swagger
     *  /app/MyMissionLists/:userId:
     *    get:
     *      tags:
     *      - Mission
     *      description: 유저의 모든 미션 리스트 화면 get
     *      produces:
     *      - application/json
     *      parameters:
     *        - in: path
     *          name: userId
     *          required: true
     *          schema:
     *            type: integer
     *            description: 유저 Id
     *      responses:
     *       "200":
     *         description: 요청 성공
     *         content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          isSuccess:
     *                              type: boolean
     *                          code:
     *                              type: int
     *                              example: 200
     *                          message:
     *                              type: string
     *                              example: "요청 성공"
     */
    app.get('/app/MyMissionLists/:userId', mission.getMyMissionLists);

    //모든 미션 리스트 화면 get
    app.get('/app/missionLists', mission.getMissionLists);

    //my미션 생성
    app.post('/app/MyMission/:missionId', mission.postMission);

    //my미션 이름 수정
    app.patch('/app/MyMission/missionName', mission.patchMissionName);

    //my미션 친구 추가
    app.post('/app/missionWithFriend' , mission.postFriendInMission);

    //rule 추가하기
    app.post('/app/missionRule' , mission.postMissionRule);

    //상세 페이지 불러오기
    app.get('/app/MyMissionMainPage', mission.getMymissionMainPage);

    // 주간 랭킹 API
    app.get('/app/friends/rank/:userId',mission.getRank);
};
