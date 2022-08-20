const jwtMiddleware = require("../../../config/jwtMiddleware");
const challengeProvider = require("../../app/Challenge/challengeProvider");
const challengeService = require("../../app/Challenge/challengeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API Name : 챌린지 리스트 화면 get
 * [GET] /app/MyChallengeLists/:userId
 */
exports.getMyChallengeLists = async function (req, res) {
    console.log('여기 들어오나?')

    //const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId

    // if(!userIdFromJWT){
    //     return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    // }

    if(!userId){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    }

    const getMyChallengeListsResponse = await challengeProvider.getMyChallengeLists(userId);

    return res.send(response(baseResponse.SUCCESS, getMyChallengeListsResponse));

}
