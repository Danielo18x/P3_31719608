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
            components: undefined,
        },
        components: {
            schemas: {
                RegisterDTO: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "string" },
                        email: { type: "string", example: "user@example.com" },
                        password: { type: "string", example: "string" }
                    }
                },
                LoginDTO: {
                    type: "object",
                    required: ["name", "password"],
                    properties: {
                        name: { type: "string", example: "string" },
                        password: { type: "string", example: "string" }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "string" },
                        email: { type: "string", example: "user@example.com" },
                        password: { type: "string", example: "$2b$10$..." }
                    }
                },
                UpdateUser: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "string" },
                        email: { type: "string", example: "user@example.com" },
                        password: { type: "string", example: "string" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "error" },
                        message: { type: "string", example: "string" }
                    }
                },
                SucessResponse: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "danilo" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);
export default specs;