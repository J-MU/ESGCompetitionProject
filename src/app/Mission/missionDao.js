
exports.getMyMissionLists = async function (connection, userId,status){
    let dateString="";

    if(status=="completed"){
        dateString=",date_format(MC.endDate,'%Y-%m-%d') as endDate";
    }

    const selectMyMissionListsQuery = `
    select MCF.groupId, C.missionId, MC.missionName,C.category, date_format(MC.createdAt,'%Y-%m-%d') as startDate,MC.groupId ${dateString}
        from MyMissionsWithFriends as MCF
        inner join MyMission as MC on MC.groupId=MCF.groupId
        inner join Missions as C on C.missionId=MC.missionId
        where MCF.userId=${userId} and MC.status="${status}"
        order by MC.createdAt desc;
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
    select missionId ,missionName, descriptionImgUrl,descriptionComment1,descriptionComment2
    from Missions LIMIT 5;
`;//TODO 데이터 부족으로 일단 5개까지만

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
    update MyMission set day="${day}", number="${num}" where groupId=${groupId}
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

// 상세페이지 Stamp받은날 불러오기
exports.getStampDays = async function(connection, groupId,userId) {

    const selectStampDaysQuery = `
        select DATE_FORMAT(date,'%Y-%m-%d') as date from Stamp
        WHERE groupId=${groupId} and userId=${userId};
    `

    const StampDays = await connection.query(selectStampDaysQuery,groupId)

    return StampDays[0];
}

//상세페이지 친구 ranking 가져오기
exports.getFriendsRanking = async function(connection, groupId, userId) {
    const selectFriendRankingQuery = `
    Select * from (
        select MMF.userId, U.userName,U.userLevel, U.profileImgUrl, MMF.stamp, rank() over(order by MMF.stamp desc) as ranking
        from MyMissionsWithFriends as MMF
                 inner join Users as U on U.userId=MMF.userId
        where groupId=${groupId})as MainTable
        where MainTable.userId=${userId}
        UNION ALL
        select MMF.userId, U.userName,U.userLevel, U.profileImgUrl, MMF.stamp, rank() over(order by MMF.stamp desc) as ranking
        from MyMissionsWithFriends as MMF
                 inner join Users as U on U.userId=MMF.userId
        where groupId=${groupId};
    `
    const FriendsRankingRows = await connection.query(selectFriendRankingQuery,groupId, userId)

    return FriendsRankingRows[0];

}


exports.getRank = async function(connection,userId) {

    const getRankQuery =  `
    SELECT userId,userLevel,userName,stamp,profileImgUrl,rank() over(order by stamp desc) as ranking FROM Users
    WHERE userId=${userId}
    UNION ALL
    SELECT userId,userLevel,userName,stamp,profileImgUrl,rank() over(order by stamp desc) as ranking FROM(
        select userId,userLevel,userName,stamp,profileImgUrl from Users
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
        SELECT userId,userLevel,userName,stamp,profileImgUrl from Users
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
    select bannerId, bannerImage, bannerTitle, eventTitle, eventContent,category
        from RecommendedMission
        order by rand()
    `

    const recommendedMissionResults = await connection.query(getRecommendedMissionQuery)

    return recommendedMissionResults[0];
}


//myMission 친구 추가 리스트

exports.getFriendLists = async function(connection, userId, groupId) {
    const getFriendListsQuery = `
        select Users.userId, userName, profileImgUrl
        from Users
                 inner join Friends as F on F.userFirstId=Users.userId
        where userSecondId=${userId} and (userId not in (select userId
                                                         from MyMissionsWithFriends
                                                         where groupId=${groupId}))
        union
        select Users.userId, userName, profileImgUrl
        from Users
                 inner join Friends as F on F.userSecondId=Users.userId
        where userFirstId=${userId} and (userId not in (select userId
                                                        from MyMissionsWithFriends
                                                        where groupId=${groupId}))
    `

    const FriendListsResults = await connection.query(getFriendListsQuery,userId, groupId)

    return FriendListsResults[0];

}


//인증페이지 API
exports.getConfirmationPage = async function(connection, groupId) {
    const getConfirmationPageQuery = `
        select Confirmation.Id , userName,U.userLevel, profileImgUrl, likeNum, date_format(Confirmation.updatedAt,"%Y-%m-%d") as day
        from Confirmation
        inner join Users U on Confirmation.userId = U.userId
        where groupId=${groupId}
        order by date_format(Confirmation.updatedAt,"%Y-%m-%d") desc , likeNum desc
    `
    const confirmationPageResults = await connection.query(getConfirmationPageQuery,groupId)

    return confirmationPageResults[0];
}

exports.getConfirmationImg = async function(connection, Id) {
    const getConfirmationImg = `
        select imgUrl
        from ConfirmationImg
        where Id=${Id}
    `
    const confirmationImgResults = await connection.query(getConfirmationImg,Id)

    return confirmationImgResults[0];
}

//좋아요 추가

exports.postConfirmationPageLike = async function(connection, userId, feedId) {
    const postConfirmationPageLike = `
        insert into ConfirmationLike(Id, userId)
        value(${feedId},${userId})
    `
    const confirmationPageLikeResults = await connection.query(postConfirmationPageLike);
    console.log(confirmationPageLikeResults)
    return confirmationPageLikeResults;
}

exports.deleteConfirmationPageLike = async function(connection, userId, feedId) {
    const deleteConfirmationPageLike = `
        DELETE FROM ConfirmationLike
        WHERE Id=${feedId} and userId=${userId};
    `
    console.log(deleteConfirmationPageLike);

    const deleteConfirmationPageLikeResults = await connection.query(deleteConfirmationPageLike);


    return deleteConfirmationPageLikeResults;
}


exports.addLikeNum = async function(connection, feedId) {
    
    const updateConfirmationPageLike = `
        update Confirmation set likeNum = likeNum+1  where Id=${feedId}
    `
    
    const confirmationImgResults = await connection.query(updateConfirmationPageLike);

    return ;
}

exports.deleteLikeNum = async function(connection, feedId) {
    
    const updateConfirmationPageLike = `
        update Confirmation set likeNum = likeNum-1  where Id=${feedId}
    `
    
    const updateConfirmationPageLikeResults = await connection.query(updateConfirmationPageLike);

    return updateConfirmationPageLikeResults;
}

exports.selectUserName = async function(connection, userId){

    const selectUserNameQuery = `
        select userName
        from Users
        where userId=${userId}
    `
    const userNameResult = await connection.query(selectUserNameQuery,userId);

    const userName = userNameResult[0][0].userName

    return userName;
}
exports.insertNotifications = async function(connection, feedId, message) {

    const insertNotificationsQuery = `
        insert into Notifications (userId,message)
            value((select userId from Confirmation where Id=${feedId})
            ,'${message}');
    `
    const insertNotificationsResult = await connection.query(insertNotificationsQuery,feedId, message);

    return insertNotificationsResult[0].insertId

}

exports.insertNotifications_Of_FriendLike = async function(connection,notificationId, userId, feedId ){

    const insertNotifications_Of_FriendLikeQuery = `
     insert into Notifications_Of_FriendLike (notificationId,friendId,feedId)
        value(${notificationId},${userId},${feedId});
    `
    const insertNotifications_Of_FriendLikeResult = await connection.query(insertNotifications_Of_FriendLikeQuery,notificationId, userId, feedId);

    return;
}
exports.UserInGroupCheck = async function(connection, userId,groupId) {

    const selectUserInGroupQuery = `
        select userId
        from MyMissionsWithFriends
        where groupId=${groupId} and userId=${userId}
    `
    const userInGroupResult  = await connection.query(selectUserInGroupQuery,userId,groupId);

    return userInGroupResult[0];
}