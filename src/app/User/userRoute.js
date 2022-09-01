module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

//0. 테스트 API
/**
 * @swagger
 *  /app/test:
 *    get:
 *      tags:
 *      - Test
 *      description: Test API
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: category
 *          required: false
 *          schema:
 *            type: integer
 *            description: 카테고리
 *      responses:
 *       200:
 *        description: 테스트 API 정상 작동
 */
     app.get('/app/test', user.getTest)

/**
 * @swagger
 *  /app/users:
 *    post:
 *      tags:
 *      - User
 *      description: 회원가입 API<br>
 *                   Kakao를 통해 회원가입 한 유저의 정보를<br>
 *                   서비스의 DB에 저장한다.
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          description: The user to create.
 *          required: false
 *          schema:
 *            type: object
 *            required:
 *              - userId
 *              - profileImg
 *            properties:
 *              userId:
 *                  type: integer
 *              profileImg:
 *                  type: string
 *          
 *      responses:
 *       200:
 *        description: 테스트 API 정상 작동
 */
    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 유저 조회 API
    app.get('/app/users',user.getUsers); 

    // 3. 특정 유저 조회 API (=유저 프로필 정보)
    app.get('/app/users/:userId', user.getUserById);

    
    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API