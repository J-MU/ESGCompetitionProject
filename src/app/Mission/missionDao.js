
exports.getMyMissionLists = async function (connection, userId,status){
    let dateString="";

    if(status=="completed"){
        dateString=",date_format(MC.endDate,'%Y-%m-%d') as endDate";
    }

    const selectMyMissionListsQuery = `
        select MCF.groupId, C.missionId, MC.missionName, date_format(MC.createdAt,'%Y-%m-%d') as startDate ${dateString}
        from MyMissionsWithFriends as MCF
        inner join MyMission as MC on MC.groupId=MCF.groupId
        inner join Missions as C on C.missionId=MC.missionId
        where MCF.userId=${userId} and MC.status="${status}";
    `
    console.log(selectMyMissionListsQuery);
    const MyMissionListsRows = await connection.query(selectMyMissionListsQuery);
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

//myMission rule 추가

exports.postMissionRule = async function (connection, groupId, day, num) {
    const insertMissionRuleQuery= `
        update MyMission set day=${day}, number=${num} where groupId=${groupId}
    `
    await connection.query(insertMissionRuleQuery,groupId, day, num)
}

//상세 페이지

exports.getMyMissionMainPage = async function(connection, groupId) {

    const selectMyMissionMainPageQuery = `
        select missionName,
                DATEDIFF(endDate, startDate) as totaldays,
                day, number,
                (DATEDIFF(endDate, startDate) div day * number) as totalNum
        from MyMission
        where groupId=?
    `

    const MyMissionMainPageInfoRows = await connection.query(selectMyMissionMainPageQuery,groupId)

    return MyMissionMainPageInfoRows[0];
}

//상세페이지 친구 ranking 가져오기
exports.getFriendsRanking = async function(connection, groupId, userId) {
    const selectFriendRankingQuery = `
        select MMF.userId, U.userName, U.profileImgUrl, MMF.stamp, '0' as ranking
        from MyMissionsWithFriends as MMF
                 inner join Users as U on U.userId=MMF.userId
        where groupId=${groupId} and U.userId=(${userId})
        union
        select MMF.userId, U.userName, U.profileImgUrl, MMF.stamp, rank() over(order by MMF.stamp desc) as ranking
        from MyMissionsWithFriends as MMF
                 inner join Users as U on U.userId=MMF.userId
        where groupId=${groupId} and U.userId not in (${userId})
    `
    const FriendsRankingRows = await connection.query(selectFriendRankingQuery,groupId, userId)

    return FriendsRankingRows[0];

}


exports.getRank = async function(connection,userId) {

    const getRankQuery =  `
    SELECT userId,userLevel,userName,stamp,rank() over(order by stamp desc) as ranking FROM(
        select userId,userLevel,userName,stamp from Users
        RIGHT JOIN (
            SELECT CASE
                    WHEN(userFirstId=${userId}) THEN userSecondId
                    WHEN(userSecondId=${userId}) THEN userFirstId
                ELSE 'error'
                END AS 'FriendId'
            FROM Friends
            where userFirstId=${userId} or userSecondId=${userId}
        ) as MyFriend
        on Users.userId=MyFriend.FriendId
        UNION DISTINCT
        SELECT userId,userLevel,userName,stamp from Users
        where userId=${userId}
        ORDER BY stamp DESC LIMIT 3
        ) AS TotalRank;
    `;

    const rankLists = await connection.query(getRankQuery);

    return  rankLists[0];
}

//missionId check
exports.missionIdCheck = async function(connection, missionId) {
    const missionIdCheckQuery = `
        select missionId
        from Missions
        where missionId=?;
    `
    const missionIdRows = await connection.query(missionIdCheckQuery,missionId)

    return missionIdRows[0];
}

//groupId check
exports.groupIdCheck = async function(connection, groupId) {
    const groupIdCheckQuery = `
        select groupId
        from MyMission
        where groupId=?;
    `
    const groupIdRows = await connection.query(groupIdCheckQuery,groupId)

    return groupIdRows[0];
}

//추천 미션 보여주기

exports.getRecommendedMission = async function(connection) {
    const getRecommendedMissionQuery = `
        select bannerId, bannerImage, bannerTitle, eventTitle, eventContent
        from RecommendedMission
        order by rand()
    `

    const recommendedMissionResults = await connection.query(getRecommendedMissionQuery)

    return recommendedMissionResults[0];
}
