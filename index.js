const express = require('./config/express');
const {logger} = require('./config/winston');
const app=express();

const port = 3001;
const upload = require('./upload');

app.post('/single', upload.single('img'), (req,res,next) => {
    res.status(201).send(req.file);
})

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);



//test입니다.