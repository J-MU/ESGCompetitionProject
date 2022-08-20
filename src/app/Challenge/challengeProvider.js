const challengeDao = require("../../app/Challenge/challengeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");
const {pool} = require("../../../config/database");


exports.getMyChallengeLists = async function (userId){
    let MyChallengeListsResult

    const connection = await pool.getConnection(async (conn) => conn);

    MyChallengeListsResult = await challengeDao.getMyChallengeLists(connection, userId);

    //groupId와  userId를 바탕으로 ChallengeLists에 저장된 친구 가져오기


    for(let i=0; i<MyChallengeListsResult.length; i++){

        const groupId = MyChallengeListsResult[i].groupId
        const FriendsParticipatedInChallengeResult = await challengeDao.getFriends(connection, groupId, userId);

        MyChallengeListsResult[i].friends = FriendsParticipatedInChallengeResult;
    }
    connection.release();
    return MyChallengeListsResult;

}