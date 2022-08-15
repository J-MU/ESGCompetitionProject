const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: '3.39.44.130:80',
        basePath: '/'
    },
    apis: ['../index.js']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};
