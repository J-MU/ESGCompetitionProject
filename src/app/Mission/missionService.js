const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {pool} = require("../../../config/database");
const {response, errResponse} = require("../../../config/response");
const userProvider = require("../User/userProvider");


//myMission 생성
exports.postMission = async function (userId, missionId) {
    const connection = await pool.getConnection(async (conn) => conn);

    //userId check

    const userIdCheck = await userProvider.userIdCheck(userId);

    if (userIdCheck.length<=0){

        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    //missionId check
    const missionIdCheck = await missionDao.missionIdCheck(connection, missionId);

    if (missionIdCheck.length<=0){

        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    const postMissionInsertId = await missionDao.postMission(connection,userId,missionId);
    connection.release();

    const postMissionResult ={}
    postMissionResult.groupId=postMissionInsertId
    return response(baseResponse.SUCCESS, postMissionResult);
}


//myMission 이름 바꾸기
exports.patchMissionName = async function(groupId, newMissionName) {
    const connection = await pool.getConnection(async (conn) => conn);

    //groupId check
    const groupIdCheck = await missionDao.groupIdCheck(connection, groupId);

    if (groupIdCheck.length<=0){

        return (errResponse(baseResponse.GROUP_NOT_EXIST));
    }

    //user가 groupId 사람이 맞는지 check
    await missionDao.patchMissionName(connection,groupId, newMissionName);

    return response(baseResponse.SUCCESS);
}

//myMission 친구 추가
exports.postFriendInMission = async function(groupId, friendId) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postFriendInMission(connection,groupId, friendId);
}

//myMission rule 추가

exports.postMissionRule = async function(groupId, day, num) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postMissionRule(connection,groupId, day, num);
}