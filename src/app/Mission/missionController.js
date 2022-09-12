const jwtMiddleware = require("../../../config/jwtMiddleware");
const missionProvider = require(".//missionProvider");
const missionService = require(".//missionService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API Name : my챌린지 리스트 화면 get
 * [GET] /app/MyChallengeLists/:userId
 */
exports.getMyMissionLists = async function (req, res) {

    //const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId
    const status=req.query.status; // 진행중인지 완료인지 구분

    // if(!userIdFromJWT){
    //     return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    // }

    if(!userId){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    }

    const getMyMissionListsResponse = await missionProvider.getMyMissionLists(userId,status);

    return res.send(getMyMissionListsResponse);

}

/**
 * API Name : 챌린지 리스트 화면 get
 * [GET] /app/challengeLists
 */
exports.getMissionLists = async function(req,res) {
    //TODO 권한 validation

    const getMissionListsResponse = await missionProvider.getMissionLists();

    return res.send(response(baseResponse.SUCCESS, getMissionListsResponse));
}

/**
 * API Name : my미션 생성 post
 * [post] /app/MyMission
 */

exports.postMission = async function(req,res) {

    const userId=1  //TODO userId Default 한번씩 다 확인해보세요.
    const missionId= req.params.missionId

    //userId validation
    if(!userId){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    }

    if(!missionId){
        return res.send(errResponse(baseResponse.MISSIONID_EMPTY));
    }

    const postMissionResponse = await missionService.postMission(userId, missionId);

    return res.send(postMissionResponse);
}


/**
 * API name : myMission 이름 바꾸기
 * [patch] /app/MyMission/missionName
 */

exports.patchMissionName = async function(req,res) {
    const groupId = req.body.groupId
    const newMissionName = req.body.newMissionName

    //validation
    if(!groupId) {
        return res.send(errResponse(baseResponse.MISSION_GROUPID_EMPTY));
    }

    //newMissionName validation
    if(!newMissionName) {
        return res.send(errResponse(baseResponse.NEW_MISSIONNAME_EMPTY));
    }

    const patchMissionNameResult = await missionService.patchMissionName(groupId, newMissionName);

    return res.send(patchMissionNameResult)
}

/**
 *
 *
 */

exports.postFriendInMission = async function(req, res) {
    const groupId = req.params.groupId
    const friendId = req.body.friendId //배열로 받아옴

    //validation
    if(!groupId) {
        return res.send(errResponse(baseResponse.MISSION_GROUPID_EMPTY));
    }

    if(!friendId) {
        return res.send(errResponse(baseResponse.FRIENDID_EMPTY));
    }

    await missionService.postFriendInMission(groupId, friendId)

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * 친구목록 가져오는 API
 */
exports.getFriendLists = async function (req,res) {

    const userId = req.params.userId
    const groupId = req.query.groupId

    const getFriendListsResult = await missionProvider.getFriendLists(userId, groupId);

    return res.send(response(baseResponse.SUCCESS,getFriendListsResult));
}
/**
 * 미션 rule 만들기
 *
 */

exports.postMissionRule = async function (req,res) {

    const groupId = req.body.groupId
    const day = req.body.day
    const num = req.body.number

    await missionService.postMissionRule(groupId,day, num);

    return res.send(response(baseResponse.SUCCESS));//기다리고있을꺼잖아요
}

/**
 * 상세 페이지 불러오기
 *
 * /app/MyMissionMainPage
 */

exports.getMymissionMainPage = async function(req, res){

    const groupId=req.params.groupId
    const userId=req.params.userId
    const getMyMissionMainPageResponse = await missionProvider.getMyMissionMainPage(groupId, userId);

    return res.send(response(baseResponse.SUCCESS,getMyMissionMainPageResponse));
}

exports.getRank=async function(req,res){
    const userId=req.params.userId;

    const getRankResponse=await missionProvider.getRank(userId);
    
    return res.send(response(baseResponse.SUCCESS,getRankResponse));
}

exports.receiveRecommendedMission=async function(req,res){

    const getRecommendedMission=await missionProvider.receiveRecommendedMission();
    
    return res.send(response(baseResponse.SUCCESS,getRecommendedMission));
}

/**
 * 인증하는 API
 *
 */

exports.getConfirmationPage = async function(req,res) {

    const groupId = req.params.groupId;
    const userId=req.query.userId;  //TODO 나중에 JWT로 고칠려고 그냥 QUERY에 일단 넣어놈.
    const getConfirmationPageResponse=await missionProvider.getConfirmationPage(groupId,userId);

    return res.send(response(baseResponse.SUCCESS,getConfirmationPageResponse));
}

// 좋아요 추가 API

exports.postConfirmationPageLike = async function(req, res) {

    //TODO JWT
    const userId = 2;
    const feedId = req.params.Id;
    // const idontno=req.query.userId;

    console.log("좋아요~!");
    const postConfirmationPageLikeResponse = await missionService.postConfirmationPageLike(userId,feedId);

    return res.send(response(baseResponse.SUCCESS));

}

exports.deleteConfirmationPageLike = async function(req, res) {

    //TODO JWT
    const userId = 2;
    const feedId = req.params.Id;
    // const idontno=req.query.userId;

    console.log("좋아요를 삭제하겠습니다 ^^");
    const postConfirmationPageLikeResponse = await missionService.deleteConfirmationPageLike(userId,feedId);

    return res.send(response(baseResponse.SUCCESS));

}