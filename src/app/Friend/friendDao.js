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
    `;
  const userIdRow = await connection.query(userIdCheckQuery, userId);
  console.log(userIdCheckQuery);
  console.log(userIdRow);
  console.log(userId);
  return userIdRow[0];
}
async function selectFriendIdList(connection, friendcode, userId) {
  console.log(friendcode);
  console.log(isNaN(friendcode));
  let selectUserFriendQuery;
  if (!isNaN(friendcode)) {
    selectUserFriendQuery = `
        SELECT Users.userId
            FROM Users
            WHERE secondId=${friendcode};`;
  } else {
    selectUserFriendQuery = `
    SELECT Users.userId
        FROM Users
         where Users.userName LIKE "%${friendcode}%"`;
  }

  console.log(selectUserFriendQuery);
  const userFriendResult = await connection.query(
    selectUserFriendQuery,
    friendcode
  );

  console.log("여기");
  console.log(userFriendResult);
  return userFriendResult[0];
}

async function selectUserFriend(connection, friendcode, friendId,myId) {
  console.log(friendcode);
  console.log(isNaN(friendcode));
  let selectUserFriendQuery;

  if (!isNaN(friendcode)) {
    selectUserFriendQuery = `
        SELECT Users.userId,
       secondId,
       userLevel,
       userName,
       statusMessage,
       profileImgUrl,
       IF(IsFriend.userFirstId,true,false) as isFriend,
       IF(HasRequest.friendId,true,false) as hasRequest,
       IF(SendRequest.friendId,true,false) as sendRequest
 FROM Users
 LEFT JOIN (
     SELECT * FROM Friends
        WHERE userFirstId=${firstId} and userSecondId=${secondId}
 )IsFriend on IsFriend.userSecondId=Users.userId # 친구의 userId가 userFisrtId이다.
 LEFT JOIN(
     SELECT Notifications.notificationId,Notifications.userId,Notifications.message,Notificaitons_Of_FriendRequest.friendId FROM Notificaitons_Of_FriendRequest
    LEFT JOIN Notifications on Notifications.notificationId=Notificaitons_Of_FriendRequest.notificationId
    WHERE Notifications.userId=${myId} and friendId=${friendId}
 )HasRequest on HasRequest.friendId=Users.userId
 LEFT JOIN(
     SELECT Notifications.notificationId,Notifications.userId,Notifications.message,Notificaitons_Of_FriendRequest.friendId FROM Notificaitons_Of_FriendRequest
    LEFT JOIN Notifications on Notifications.notificationId=Notificaitons_Of_FriendRequest.notificationId
    WHERE Notifications.userId=${friendId} and friendId=${myId}
 )SendRequest on SendRequest.userId=Users.userId
 WHERE secondId=${friendcode};`;
  } else {
    selectUserFriendQuery = `
    SELECT Users.userId,
       secondId,
       userLevel,
       userName,
       statusMessage,
       profileImgUrl,
       IF(IsFriend.userFirstId,true,false) as isFriend,
       IF(HasRequest.friendId,true,false) as hasRequest,
       IF(SendRequest.friendId,true,false) as sendRequest
 FROM Users
 LEFT JOIN (
     SELECT * FROM Friends
        WHERE userFirstId=${firstId} and userSecondId=${secondId}
 )IsFriend on IsFriend.userSecondId=Users.userId # 친구의 userId가 userFisrtId이다.
 LEFT JOIN(
     SELECT Notifications.notificationId,Notifications.userId,Notifications.message,Notificaitons_Of_FriendRequest.friendId FROM Notificaitons_Of_FriendRequest
    LEFT JOIN Notifications on Notifications.notificationId=Notificaitons_Of_FriendRequest.notificationId
    WHERE Notifications.userId=${myId} and friendId=${friendId}
 )HasRequest on HasRequest.friendId=Users.userId
 LEFT JOIN(
     SELECT Notifications.notificationId,Notifications.userId,Notifications.message,Notificaitons_Of_FriendRequest.friendId FROM Notificaitons_Of_FriendRequest
    LEFT JOIN Notifications on Notifications.notificationId=Notificaitons_Of_FriendRequest.notificationId
    WHERE Notifications.userId=${friendId} and friendId=${myId}
 )SendRequest on SendRequest.userId=Users.userId
 where Users.userName LIKE "%${friendcode}%"`;
  }

  const userFriendResult = await connection.query(
    selectUserFriendQuery,
    friendcode
  );

  return userFriendResult[0];
}

async function insertUserFriend(connection, friendId, userId) {
  if (userId < friendId) {
    const insertUserFriendQuery = `
            insert into Friends (userFirstId,userSecondId)
            value(${userId},${friendId})
        `;
    const insertUserFriendResult = await connection.query(
      insertUserFriendQuery,
      friendId,
      userId
    );

    return;
  } else {
    const insertUserFriendQuery = `
            insert into Friends (userFirstId,userSecondId)
            value(${friendId}, ${userId})
        `;
    const insertUserFriendResult = await connection.query(
      insertUserFriendQuery,
      friendId,
      userId
    );

    return;
  }
}

async function selectFriendId(connection, friendcode) {
  const selectFriendIdQuery = `
    select userId
    from Users
    where userUniqueCode='${friendcode}'
  `;
  const friendId = await connection.query(selectFriendIdQuery, friendcode);
  console.log(friendId[0]);
  return friendId[0][0].userId;
}

async function insertNotifications(connection, friendId, message) {
  const insertNotificationsQuery = `
        insert into Notifications (userId,message)
            value(${friendId}
            ,'${message}');
    `;
  const insertNotificationsResult = await connection.query(
    insertNotificationsQuery,
    friendId,
    message
  );

  return insertNotificationsResult[0].insertId;
}

async function postNotificationFriendAcceptance(
  connection,
  notificationId,
  friendId
) {
  const insertNotificationsQuery = `
        insert into Notifications_Of_FriendAcceptance (notificationId,friendId)
            VALUES(${notificationId},${friendId});
    `;
  const insertNotificationsResult = await connection.query(
    insertNotificationsQuery
  );

  return insertNotificationsResult[0];
}

async function insertNotifications_Of_FriendRequest(
  connection,
  notificationId,
  friendId
) {
  const acceptFriendRequestQuery = `
        INSERT INTO Notifications_Of_FriendAcceptance
        VALUES(${notificationId},${friendId})
    `;
  const acceptFriendRequestResult = await connection.query(
    acceptFriendRequestQuery
  );

  return acceptFriendRequestResult[0];
}

async function selectFriendIdFromNotification(connection, notificationId) {
  const selectFriendIdQuery = `
        select friendId
        from Notificaitons_Of_FriendRequest
        where notificationId=${notificationId}
    `;

  const friendIdResult = await connection.query(
    selectFriendIdQuery,
    notificationId
  );

  return friendIdResult[0][0].friendId;
}
module.exports = {
  getFriends,
  selectUserFriend,
  insertUserFriend,
  selectFriendId,
  insertNotifications,
  insertNotifications_Of_FriendRequest,
  selectFriendIdFromNotification,
  postNotificationFriendAcceptance,
  selectFriendIdList,
};
