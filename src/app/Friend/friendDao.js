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

module.exports = {
    getFriends
};