const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");
const {pool} = require("../../../config/database");
const userProvider = require("../User/userProvider");
const {errResponse, response} = require("../../../config/response");



exports.getMyMissionLists = async function (userId,status){
    const connection = await pool.getConnection(async (conn) => conn);
    //userId db에 있는지 체크

    const userIdCheck = await userProvider.userIdCheck(userId);

    if (userIdCheck.length<=0){

        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    let MyMissionListsResult

    MyMissionListsResult = await missionDao.getMyMissionLists(connection, userId,status);

    //groupId와  userId를 바탕으로 ChallengeLists에 저장된 친구 가져오기

    for(let i=0; i<MyMissionListsResult.length; i++){

        const groupId = MyMissionListsResult[i].groupId
        const FriendsParticipatedInMissionResult = await missionDao.getFriends(connection, groupId, userId);

        MyMissionListsResult[i].friends = FriendsParticipatedInMissionResult;
    }
    console.log(MyMissionListsResult[0]);
    connection.release();

    return response(baseResponse.SUCCESS, MyMissionListsResult);

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

    const stampDateList=await missionDao.getStampDays(connection,groupId,userId);
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
    MyMissionMainPageResult.stampDays=stampDateList

    connection.release();
    return MyMissionMainPageResult;
}

exports.getRank = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result={};

    result.rankLists = await missionDao.getRank(connection,userId);
    connection.release();

    return result;
}

//추천 미션 보여주기
exports.receiveRecommendedMission = async function () {
    const connection = await pool.getConnection(async (conn) => conn);

    const recommendedMissionResults = await missionDao.getRecommendedMission(connection);
    connection.release();

    return recommendedMissionResults;
}

//myMission 친구 추가 리스트 가져오기
exports.getFriendLists = async function(userId, groupId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const FriendListsResults = await missionDao.getFriendLists(connection,userId, groupId);
    connection.release();

    return FriendListsResults;
}

//인증 페이지 가져오기 API
exports.getConfirmationPage = async function(groupId) {

    let confirmationPageResults;

    const connection = await pool.getConnection(async (conn) => conn);

    confirmationPageResults = await missionDao.getConfirmationPage(connection, groupId);
    for(let i=0; i<confirmationPageResults.length; i++) {

        const confirmationImgResults = await missionDao.getConfirmationImg(connection, confirmationPageResults[i].Id);
        confirmationPageResults[i].ImgUrl = []
        for(let j=0; j<confirmationImgResults.length; j++){

            confirmationPageResults[i].ImgUrl.push(confirmationImgResults[j].imgUrl)

        }
    }
    connection.release();

    return  confirmationPageResults;
}