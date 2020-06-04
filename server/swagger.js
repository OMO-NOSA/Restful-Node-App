const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: "Documented Todo APIs Definitions",
            version: "1.0.0",
            description: "A Project for Todo API",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Swagger",
                url: "https://swagger.io",
                email: "Info@SmartBear.com"
            }
        },
        servers: [{
            url: "http://localhost:3000/api-docs/"
        }]
    },
    apis: ['./docs/user.yaml', './server.js'],
    //["./server.js", "./models/user.js"],
};


const specs = swaggerJsdoc(options);
module.exports = { specs };