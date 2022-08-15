const express = require('./config/express');
const {logger} = require('./config/winston');
const { swaggerUi, specs } = require('./config/swagger.js');


const port = 3000;
app=express();
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
