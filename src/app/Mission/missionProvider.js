const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");
const {pool} = require("../../../config/database");
const userProvider = require("../User/userProvider");
const {errResponse} = require("../../../config/response");



exports.getMyMissionLists = async function (userId){
    const connection = await pool.getConnection(async (conn) => conn);
    //userId db에 있는지 체크

    const userIdCheck = await userProvider.userIdCheck(userId);

    if (userIdCheck.length<=0){

        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    let MyMissionListsResult

    MyMissionListsResult = await missionDao.getMyMissionLists(connection, userId);

    //groupId와  userId를 바탕으로 ChallengeLists에 저장된 친구 가져오기

    for(let i=0; i<MyMissionListsResult.length; i++){

        const groupId = MyMissionListsResult[i].groupId
        const FriendsParticipatedInMissionResult = await missionDao.getFriends(connection, groupId, userId);

        MyMissionListsResult[i].friends = FriendsParticipatedInMissionResult;
    }
    connection.release();

    return MyMissionListsResult;

}

exports.getMissionLists = async function () {
    const connection = await pool.getConnection(async (conn) => conn);

    const missionListsResult = await missionDao.getMissionLists(connection);
    connection.release();
    return missionListsResult;
}

//상세페이지 불러오기
exports.getMyMissionMainPage = async function(groupId, userId) {
    let MyMissionMainPageResult = {}
    let friendsList =[]

    const connection = await pool.getConnection(async (conn) => conn);

    const missionMainPageInfo = await missionDao.getMyMissionMainPage(connection, groupId);

    const rankingResult = await missionDao.getFriendsRanking(connection, groupId, userId);

    //친구 목록 프로필 사진 가져오기
    for(let i=1; i<rankingResult.length;i++){
        let friend = {}
        friend.userName=rankingResult[i].userName
        friend.profileImgUrl = rankingResult[i].profileImgUrl

        friendsList.push(friend)
    }

    MyMissionMainPageResult.missionMainPageInfo = missionMainPageInfo
    MyMissionMainPageResult.friendLists = friendsList
    MyMissionMainPageResult.rankingLists = rankingResult

    connection.release();
    return MyMissionMainPageResult;
}

exports.getRank = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const rankLists = await missionDao.getRank(connection,userId);
    connection.release();
    return rankLists;
}