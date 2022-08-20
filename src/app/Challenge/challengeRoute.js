module.exports = function(app) {
    const challenge = require('./challengeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //챌린지 리스트 화면 get

    app.get('/app/MyChallengeLists/:userId', challenge.getMyChallengeLists);

 console.log('hello')
};
