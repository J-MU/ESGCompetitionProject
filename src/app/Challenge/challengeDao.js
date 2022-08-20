
exports.getMyChallengeLists = async function (connection, userId){
    console.log('여기 오나?')

    const selectMyChallengeListsQuery = `
        select MCF.groupId, C.challengeId, MC.challengeName, C.emoji
        from MyChallengesWithFriends as MCF
        inner join MyChallenge as MC on MC.groupId=MCF.groupId
        inner join Challenges as C on C.challengeId=MC.challengeId
        where MCF.userId=?;
    `
    const MyChallengeListsRows = await connection.query(selectMyChallengeListsQuery, userId);
    return MyChallengeListsRows[0];

}


exports.getFriends = async function(connection, groupId, userId) {


    const selectFriendsQuery = `
        select U.userName, U.profileImgUrl
        from Users as U
        inner join MyChallengesWithFriends as MCF on U.userId=MCF.userId
        where MCF.groupId=${groupId} and MCF.userId not in (${userId})
    `

    const FriendsListsRows = await connection.query(selectFriendsQuery, groupId, userId);

    return FriendsListsRows[0];
}

