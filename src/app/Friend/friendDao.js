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

async function insertNotifications_Of_FriendRequest(connection,notificationId, userId) {

    const insertNotifications_Of_FriendRequestQuery = `
        insert into Notificaitons_Of_FriendRequest (notificationId, friendId)
            value(${notificationId}
            ,${userId});
    `
    const insertNotifications_Of_FriendRequestResult = await connection.query(insertNotifications_Of_FriendRequestQuery,notificationId, userId);

    return;

}
module.exports = {
    getFriends,
    selectUserFriend,
    insertUserFriend,
    selectFriendId,
    insertNotifications,
    insertNotifications_Of_FriendRequest
};