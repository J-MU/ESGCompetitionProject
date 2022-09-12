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

        connection.release();
        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    //missionId check
    const missionIdCheck = await missionDao.missionIdCheck(connection, missionId);

    if (missionIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    const postMissionInsertId = await missionDao.postMission(connection,userId,missionId);
    console.log("post!!!!");
    console.log(postMissionInsertId);
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

        connection.release();
        return (errResponse(baseResponse.GROUP_NOT_EXIST));
    }

    //user가 groupId 사람이 맞는지 check
    await missionDao.patchMissionName(connection,groupId, newMissionName);
    connection.release();
    return response(baseResponse.SUCCESS);
}

//myMission 친구 추가
exports.postFriendInMission = async function(groupId, friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    //TODO validation 추가
    //groupId 존재하는지
    const groupIdCheck = await missionDao.groupIdCheck(connection, groupId);

    if (groupIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.GROUP_NOT_EXIST));
    }

    //유저가 group에 속해있는지

    //friendId 존재하는지

    //friend가 여기 없는지, 유저의 친구가 맞는지

    //friendId list로 받아와서 하나씩 대입
    for(let i=0; i<friendId.length; i++){
        connection.release();
        await missionDao.postFriendInMission(connection,groupId, friendId[i]);

    }
}

//myMission rule 추가

exports.postMissionRule = async function(groupId, day, num) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postMissionRule(connection,groupId, day, num);

    connection.release();
}

//좋아요 추가 API

exports.postConfirmationPageLike = async function(userId,Id) {

    const connection = await pool.getConnection(async (conn) => conn);

    const postMissionInsertId = await missionDao.postConfirmationPageLike(connection,userId,Id);

    connection.release();

    return;
}

exports.postMyMission = async function(groupId, day, num) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postMyMission(connection,groupId, day, num);

    connection.release();

    
}