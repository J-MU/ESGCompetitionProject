const missionDao = require(".//missionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {pool} = require("../../../config/database");
const {response, errResponse} = require("../../../config/response");
const userProvider = require("../User/userProvider");


//myMission 생성
exports.postMission = async function (userId, missionId) {
    const connection = await pool.getConnection(async (conn) => conn);

    //userId check

    const userIdCheck = await userProvider.userIdCheck(userId);

    if (userIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    //missionId check
    const missionIdCheck = await missionDao.missionIdCheck(connection, missionId);

    if (missionIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    const postMissionInsertId = await missionDao.postMission(connection,userId,missionId);
    console.log("post!!!!");
    console.log(postMissionInsertId);
    connection.release();

    const postMissionResult ={}
    postMissionResult.groupId=postMissionInsertId
    return response(baseResponse.SUCCESS, postMissionResult);
}


//myMission 이름 바꾸기
exports.patchMissionName = async function(groupId, newMissionName) {
    const connection = await pool.getConnection(async (conn) => conn);

    //groupId check
    const groupIdCheck = await missionDao.groupIdCheck(connection, groupId);

    if (groupIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.GROUP_NOT_EXIST));
    }

    //user가 groupId 사람이 맞는지 check
    await missionDao.patchMissionName(connection,groupId, newMissionName);
    connection.release();
    return response(baseResponse.SUCCESS);
}

//myMission 친구 추가
exports.postFriendInMission = async function(groupId, friendId) {
    console.log("service 시작");
    const connection = await pool.getConnection(async (conn) => conn);
    //TODO validation 추가
    //groupId 존재하는지
    console.log("first Query");
    const groupIdCheck = await missionDao.groupIdCheck(connection, groupId);
    console.log("first Query Success");
    if (groupIdCheck.length<=0){

        connection.release();
        return (errResponse(baseResponse.GROUP_NOT_EXIST));
    }

    //유저가 group에 속해있는지

    //friendId 존재하는지

    //friend가 여기 없는지, 유저의 친구가 맞는지

    //friendId list로 받아와서 하나씩 대입
    await missionDao.postFriendInMission(connection,groupId, friendId);
    console.log("second Query Success");
    connection.release();
}

//myMission rule 추가

exports.postMissionRule = async function(groupId, day, num) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postMissionRule(connection,groupId, day, num);

    connection.release();
}

//좋아요 추가 API

exports.postConfirmationPageLike = async function(userId,feedId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        const postMissionInsertId = await missionDao.postConfirmationPageLike(connection,userId,feedId);

        const updateLikeNum=await missionDao.addLikeNum(connection,feedId);

        const userName = await missionDao.selectUserName(connection,userId);

        const message = `${userName}님이 회원님의 사진을 좋아합니다.`

        const notificationId = await missionDao.insertNotifications(connection,feedId,message);

        const insertNotifications_Of_FriendLikeResult = await missionDao.insertNotifications_Of_FriendLike(connection,notificationId, userId, feedId);

        await connection.commit();
    }
    catch(err){
        console.log(err);
        await connection.rollback();

    }finally{

        connection.release();
    }
    return;
}

//좋아요 삭제 API

exports.deleteConfirmationPageLike = async function(userId,feedId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();
        
        console.log("pre query");
        const deleteConfirmationPageLikeResult = await missionDao.deleteConfirmationPageLike(connection,userId,feedId);
        console.log("query 1");
        console.log(deleteConfirmationPageLikeResult);
        const updateLikeNum=await missionDao.deleteLikeNum(connection,feedId);
        console.log("query2");
        await connection.commit();
    }catch(err){
        console.log(err);
        await connection.rollback();
    }finally{

        connection.release();
    }
    console.log("service end");
    return;
}

exports.postMyMission = async function(groupId, day, num) {
    const connection = await pool.getConnection(async (conn) => conn);

    await missionDao.postMyMission(connection,groupId, day, num);

    connection.release();

    return;
}

exports.makeMissionConfirmation = async function(userId, groupId) {

    const connection = await pool.getConnection(async (conn) => conn);

    const missionIdResult = await missionDao.insertNewMission(connection,userId, groupId);

    //미션 생겼으면 스탬프주기
    const giveStampResult = await missionDao.addStampInMission(connection, userId, groupId);

    //스탬프 db에 추가하기
    const insertStampResult = await missionDao.insertStampInStampDB(connection, userId, groupId);

    connection.release();

    const missionIdReturn = {}
    missionIdReturn.confirmationId = missionIdResult;

    return missionIdReturn;
}

exports.addMissionImages = async function(confirmationId,image) {

    const connection = await pool.getConnection(async (conn) => conn);

    const missionIdResult = await missionDao.insertImagesInConfirmation(connection,confirmationId,image);

    connection.release();

    return missionIdReturn;
}

exports.removeMissionConfirmation = async function(userId, confirmationId) {

    const connection = await pool.getConnection(async (conn) => conn);

    try {

        //check confirmationId

        const confirmationCheckResult = await missionDao.confirmationIdCheck(connection, userId, confirmationId);

        if(confirmationCheckResult.length<=0) {

            return errResponse(baseResponse.CONFIRMATION_NOT_EXIST)
        }

        //스탬프 추가된거 지워요
        const removeTotalStampResult = await missionDao.deleteTotalStamp(connection,userId, confirmationId);

        //스탬프 DB에 저장된 거 지워요
        const removeStampInStampDBResult = await missionDao.deleteStampInStampDB(connection,userId, confirmationId );

        //missionTable 지워요
        const missionIdResult = await missionDao.deleteMissionConfirmationInDB(connection,userId, confirmationId);



    }catch(err) {

    }
    finally {
        connection.release();
    }

    return response(baseResponse.SUCCESS);
}