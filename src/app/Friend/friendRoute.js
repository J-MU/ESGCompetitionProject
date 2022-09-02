module.exports = function(app){
    const friend = require('./friendController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/users/:userId/friends', friend.getFriends);

};

