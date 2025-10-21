import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "p3-31719608",
        version: "1.0.0",
        description: "API RESTful",
        contact: {
        name: "Danielo",
        },
        servers: [
        {
            url: "http://localhost:3000",
            description: "Local server",
        },
        ],
    },
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);
export default specs;