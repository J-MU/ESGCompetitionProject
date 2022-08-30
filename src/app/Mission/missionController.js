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

    // if(!userIdFromJWT){
    //     return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    // }

    if(!userId){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    }

    const getMyMissionListsResponse = await missionProvider.getMyMissionLists(userId);

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

    const userId=1
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

    const groupId = req.body.groupId
    const friendId = req.body.friendId

    await missionService.postFriendInMission(groupId, friendId)

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * 미션 rule 만들기
 *
 */

exports.postMissionRule = async function (req,res) {

    const groupId = req.body.groupId
    const day = req.body.day
    const num = req.body.number

    await missionService.postMissionRule(groupId,day, num)

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * 상세 페이지 불러오기
 *
 * /app/MyMissionMainPage
 */

exports.getMymissionMainPage = async function(req, res){

    const groupId=req.body.groupId
    const userId=req.body.userId

    const getMyMissionMainPageResponse = await missionProvider.getMyMissionMainPage(groupId, userId);

    return res.send(response(baseResponse.SUCCESS,getMyMissionMainPageResponse));
}