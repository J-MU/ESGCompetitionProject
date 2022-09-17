module.exports = {

    // Success 200
    SUCCESS : { "isSuccess": true, "code": 200, "message":"요청 성공" },
    NEED_SIGNUP:{"isSuccess": true, "code": 2001, "message":"아직 회원이 아닙니다. 회원가입을 진행해주세요"},
    NOT_NEED_SIGNUP:{"isSuccess": true, "code": 2002, "message":"이미 회원입니다. 회원가입할 필요가 없습니다."},
    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //user 도메일 에러 : 2000~2050
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2000, "message": "해당 회원이 존재하지 않습니다." },

    //Friend 도메인 에러 : 2050~2100
    FRIENDID_EMPTY :  { "isSuccess": false, "code": 2050, "title": "request parameter 존재 여부", "detail": "friendId를 입력해주세요.", "instance" : "/app/missionWithFriend"},


    //Mission 에러 : 2100~2200
    MISSIONID_EMPTY :  { "isSuccess": false, "code": 2100, "title": "request parameter 존재 여부", "detail": "missionId를 입력해주세요."},
    MISSION_NOT_EXIST :  { "isSuccess": false, "code": 2101, "title": "missionId값 존재 여부", "detail": "해당 미션이 존재하지 않습니다. 올바른 id 값을 넣어주세요."},
    MISSION_GROUPID_EMPTY : { "isSuccess": false, "code": 2102, "title": "request body 존재 여부", "detail": "groupId를 입력해주세요."},
    NEW_MISSIONNAME_EMPTY : { "isSuccess": false, "code": 2103, "title": "request body 존재 여부", "detail": "수정할 미션 이름을 입력해주세요."},
    GROUP_NOT_EXIST : { "isSuccess": false, "code": 2104, "title": "groupId값 존재 여부", "detail": "해당 그룹이 존재하지 않습니다. 올바른 id값을 넣어주세요."},
    USER_NOT_IN_GROUP : { "isSuccess": false, "code": 2105, "title": "request parameter 존재 여부", "detail": "유저가 해당 그룹에 존재하지 않습니다. 다시 확인해주세요."},
    CONFIRMATION_ID_EMPTY : { "isSuccess": false, "code": 2106, "title": "request parameter 존재 여부", "detail": "confirmationId를 입력해주세요."},
    CONFIRMATION_FILELOCATION_EMPTY :{ "isSuccess": false, "code": 2107, "title": "request parameter 존재 여부", "detail": "fileLocation을 입력해주세요."},

    //Request error
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2001, "message": "userId를 입력해주세요." },
    USER_NAME_EMPTY : { "isSuccess": false, "code": 2002, "message": "userName을 입력해주세요." },

    USER_PROFILEIMG_EMPTY : { "isSuccess": false, "code": 2003, "message": "프로필 이미지를 입력해주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },

    USER_USERID_INVALID_VALUE:{"isSuccess": false, "code": 2010, "message": "userId값이 정상적인 값이 아닙니다."},
    USER_NAME_TOO_LONG:{"isSuccess": false, "code": 2011, "message": "userName길이가 너무 깁니다. 20자 이하로 설정해주세요"},
    USER_NAME_INVALID_VALUE:{"isSuccess": false, "code": 2012, "message": "userName이 부적잘한 Type입니다."},

    PROFILE_IMG_INVALID_VALUE:{"isSuccess": false, "code": 2013, "message": "profileImg가 부적잘한 값입니다."},
    //2050 : mission request error


    // Response error
    ALREADY_REGISTERED_MEMBER:{"isSuccess":false,"code":3000,"message":"이미 등록된 회원입니다."},
    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


}
