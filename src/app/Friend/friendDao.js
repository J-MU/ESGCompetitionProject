async function getFriends(connection, userId) {
    const userIdCheckQuery = `
    select userId,userLevel,userName,statusMessage,profileImgUrl from Users
    RIGHT JOIN (
        SELECT CASE
                WHEN(userFirstId=${userId}) THEN userSecondId
                WHEN(userSecondId=${userId}) THEN userFirstId
            ELSE 'error'
            END AS 'FriendId'
        FROM Friends
        where userFirstId=${userId} or userSecondId=${userId}
    ) as MyFriend
    on Users.userId=MyFriend.FriendId;
    `
    const userIdRow = await connection.query(userIdCheckQuery, userId);
    console.log(userIdCheckQuery);
    console.log(userIdRow);
    console.log(userId);
    return userIdRow[0];
}

async function selectUserFriend(connection, friendcode){
    console.log(friendcode)
    const selectUserFriendQuery = `
    select userId, userLevel, userName, statusMessage, profileImgUrl
    from Users
    where userUniqueCode='${friendcode}'
  `
    const userFriendResult = await connection.query(selectUserFriendQuery, friendcode);

    return userFriendResult[0];
}

async function insertUserFriend(connection, friendId, userId){

    if(userId<friendId){
        const insertUserFriendQuery = `
            insert into Friends (userFirstId,userSecondId)
            value(${userId},${friendId})
        `
        const insertUserFriendResult = await connection.query(insertUserFriendQuery, friendId, userId);

        return;
    }else {
        const insertUserFriendQuery = `
            insert into Friends (userFirstId,userSecondId)
            value(${friendId}, ${userId})
        `
        const insertUserFriendResult = await connection.query(insertUserFriendQuery, friendId, userId);

        return;
    }


}

async function selectFriendId(connection, friendcode) {

    const selectFriendIdQuery = `
    select userId
    from Users
    where userUniqueCode='${friendcode}'
  `
    const friendId = await connection.query(selectFriendIdQuery, friendcode);
    console.log(friendId[0])
    return friendId[0][0].userId;

}

async function insertNotifications(connection,friendId,message ){

    const insertNotificationsQuery = `
        insert into Notifications (userId,message)
            value(${friendId}
            ,'${message}');
    `
    const insertNotificationsResult = await connection.query(insertNotificationsQuery,friendId, message);

    return insertNotificationsResult[0].insertId
}

async function postNotificationFriendAcceptance(connection,notificationId,friendId ){

    const insertNotificationsQuery = `
        insert into Notifications_Of_FriendAcceptance (notificationId,friendId)
            VALUES(${notificationId},${friendId});
    `
    const insertNotificationsResult = await connection.query(insertNotificationsQuery);

    return insertNotificationsResult[0];
}

async function insertNotifications_Of_FriendRequest(connection,notificationId, friendId) {

    const acceptFriendRequestQuery = `
        INSERT INTO Notifications_Of_FriendAcceptance
        VALUES(${notificationId},${friendId})
    `
    const acceptFriendRequestResult = await connection.query(acceptFriendRequestQuery);

    return acceptFriendRequestResult[0];

}

async function selectFriendIdFromNotification(connection,notificationId ) {

    const selectFriendIdQuery = `
        select friendId
        from Notificaitons_Of_FriendRequest
        where notificationId=${notificationId}
    `

    const friendIdResult = await connection.query(selectFriendIdQuery,notificationId);

    console.log(friendIdResult[0]);
    return friendIdResult[0][0].friendId
}
module.exports = {
    getFriends,
    selectUserFriend,
    insertUserFriend,
    selectFriendId,
    insertNotifications,
    insertNotifications_Of_FriendRequest,
    selectFriendIdFromNotification,
    postNotificationFriendAcceptance
};