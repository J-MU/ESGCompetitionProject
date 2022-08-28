const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {pool} = require("../../../config/database");
const {response} = require("../../../config/response");


//myMission 생성
exports.postMission = async function (userId, missionId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const postMissionInsertId = await missionDao.postMission(connection,userId,missionId);
    connection.release();

    const postMissionResult ={}
    postMissionResult.groupId=postMissionInsertId
    return postMissionResult;
}


//myMission 이름 바꾸기
exports.patchMissionName = async function(groupId, newMissionName) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.patchMissionName(connection,groupId, newMissionName);
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