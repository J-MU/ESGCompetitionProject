const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");
const {pool} = require("../../../config/database");


exports.getMyMissionLists = async function (userId){
    let MyMissionListsResult

    const connection = await pool.getConnection(async (conn) => conn);

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