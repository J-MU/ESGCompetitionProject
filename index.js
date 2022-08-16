const express = require('./config/express');
const {logger} = require('./config/winston');


const port = 3001;
app=express();
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

