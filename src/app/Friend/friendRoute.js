module.exports = function(app){
    const friend = require('./friendController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/friend/:userId', friend.getUserById);

};

