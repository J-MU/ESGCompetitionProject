const jwtMiddleware = require("../../../config/jwtMiddleware");
const friendProvider = require("./friendProvider");
const friendService = require("./friendService");
const userController=require("../User/userController");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users

 */
exports.getFriends = async function (req, res) {
/** 
    *   path variables: userId:
    **/
    /* userId가 유효한 값인지*/
    const userId=req.params.userId;
    console.log("friend get api 호출",process.uptime());
    console.log("이거 실행 됨??");
    // user Validation
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    if (await userController.checkUserIdRange(userId))
        return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

    console.log(typeof userId);
    if(isNaN(userId))
        return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

    const friendList = await friendProvider.getFriends(userId);

    console.log("ㅋㅋㅋㅋㅋ 이게 왜 됐지? 지금까지??");
    console.log(friendList);
    return res.send(response(baseResponse.SUCCESS,friendList));
};

