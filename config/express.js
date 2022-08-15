const express = require('express');
const compression = require('compression'); //클라이언트와 송수신할때 데이터 압축해서 보내도록하는 middle-ware
const methodOverride = require('method-override'); //form태크에는 get post밖에 없어서 put delete를 위해 매핑해주는 middle-ware인거 같은데 써봐야 알거 같다.
var cors = require('cors'); //Cross-Origin Resource Sharing 허용해주는데 사용되는 미들웨어
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    // require('../src/app/Board/boardRoute')(app);

    return app;
};