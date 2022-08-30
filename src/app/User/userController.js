const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
     return res.send(response(baseResponse.SUCCESS))
 }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users

 */
exports.postUsers = async function (req, res) {
/** 
    *   body: {
    *      userId:
    *      nickName:
    *      profile_image:
    *   }
    **/
    /* userId가 유효한 값인지, userName이 크기가 너무 크진 않을지, profileImgUrl이 Url형식을 지키는지*/
    const {userId,userName,profileImgUrl} = req.body;

    // user Validation
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    if (await checkUserIdRange(userId))
        return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

    console.log(typeof userId);
    if(isNaN(userId))
        return res.send(response(baseResponse.USER_USERID_INVALID_VALUE));

    //userName validation
    if(!userName)
        return res.send(response(baseResponse.USER_NAME_EMPTY));
    
    if(userName.length>20)
        return res.send(response(baseResponse.USER_NAME_TOO_LONG));

    
    if(!(typeof userName === 'string' || userName instanceof String))
        return res.send(response(baseResponse.USER_NAME_INVALID_VALUE));

    //profileImg validation
    if(!profileImgUrl)
        return res.send(response(baseResponse.USER_PROFILEIMG_EMPTY));
    
    console.log(profileImgUrl);
    console.log(typeof profileImgUrl)
    console.log(typeof profileImgUrl === 'string')
    if(!(typeof profileImgUrl === 'string' || profileImgUrl instanceof String))
        return res.send(response(baseResponse.PROFILE_IMG_INVALID_VALUE));

    

    const regexp=new RegExp("^(https://)(.+)");
    console.log(profileImgUrl);
    console.log(regexp.test(profileImgUrl));
    if(!regexp.test(profileImgUrl))
        return res.send(response(baseResponse.PROFILE_IMG_INVALID_VALUE));
    console.dir("post user 요청 왔음");
    console.dir(req.body);

    const signUpResponse = await userService.createUser(
        userId,
        userName,
        profileImgUrl
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    if(userByUserId)
        return res.send(response(baseResponse.NOT_NEED_SIGNUP));
    else
        return res.send(response(baseResponse.NEED_SIGNUP))
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

checkUserIdRange=async function(userId){
    const MAX_INT_UNSIGNED=4294967295; //42억 9496만 7295

    if(userId<0){
        return true;
    }else if(userId>MAX_INT_UNSIGNED){
        return true;
    }else{
        return false;
    }
}