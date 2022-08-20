const challengeDao = require("../../app/Challenge/challengeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");
const {pool} = require("../../../config/database");


exports.getMyChallengeLists = async function (userId){

    const connection = await pool.getConnection(async (conn) => conn);

    const MyChallengeListsResult = await challengeDao.getMyChallengeLists(connection, userId);
    console.log(MyChallengeListsResult);

    //groupId를 바탕으로 ChallengeLists에 저장된 친구 가져오기

    //const FriendsParticipatedInChallengeResult = await challengeDao.getFriends(connection, userId);

    return MyChallengeListsResult;

    connection.release();
}