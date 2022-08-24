
exports.getMyMissionLists = async function (connection, userId){

    const selectMyMissionListsQuery = `
        select MCF.groupId, C.missionId, MC.missionName, C.emoji
        from MyMissionsWithFriends as MCF
        inner join MyMission as MC on MC.groupId=MCF.groupId
        inner join Missions as C on C.missionId=MC.missionId
        where MCF.userId=?;
    `
    const MyMissionListsRows = await connection.query(selectMyMissionListsQuery, userId);
    return MyMissionListsRows[0];

}


exports.getFriends = async function(connection, groupId, userId) {

    const selectFriendsQuery = `
        select U.userName, U.profileImgUrl
        from Users as U
        inner join MyMissionsWithFriends as MCF on U.userId=MCF.userId
        where MCF.groupId=${groupId} and MCF.userId not in (${userId})
    `

    const FriendsListsRows = await connection.query(selectFriendsQuery, groupId, userId);

    return FriendsListsRows[0];
}

exports.getMissionLists = async function(connection) {

    const selectMissionListsQuery =  `
        select missionId ,missionName, descriptionImgUrl
        from Missions
    `;

    const missionListsRows = await connection.query(selectMissionListsQuery);

    return  missionListsRows[0];
}

exports.postMission = async function(connection, userId, missionId) {

    const insertMissionQuery = `
        insert into MyMission (missionId, missionName)
        values (${missionId},
                (select missionName
                 from Missions
                 where missionId = ${missionId}))
    `;

    const result = await connection.query(insertMissionQuery, missionId);

    const groupId= result[0].insertId

    const insertLeaderQuery = `
        insert into MyMissionsWithFriends (groupId,userId,position)
        values (${groupId}, ${userId},'leader')
    `

    await connection.query(insertLeaderQuery,userId,groupId)

    return groupId
}

//myMission 이름바꾸기

exports.patchMissionName = async function(connection, groupId, newMissionName) {

    const patchMissionNameQuery= `
        update MyMission set missionName = '${newMissionName}' where groupId= ${groupId}
    `
    await connection.query(patchMissionNameQuery, groupId, newMissionName)

}

//myMission 친구 추가

exports.postFriendInMission = async function(connection, groupId, friendId) {

    const postFriendInMissionQuery= `
        insert into MyMissionsWithFriends(groupId,userId,position)
        values(${groupId},${friendId},'member')
    `
    await connection.query(postFriendInMissionQuery, groupId, friendId)
}