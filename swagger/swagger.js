import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "p3-31719608 API",
      version: "1.0.0",
      description: "Documentación OpenAPI de la API — incluye recursos públicos y privados",
    },
    servers: [
      { url: "https://p3-31719608.onrender.com", description: "Servidor API" },
      { url: "http://localhost:3000", description: "Servidor local" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Error interno del servidor" }
          }
        },
        SucessResponse: {
            type: "object",
            properties: {
                name: { type: "string", example: "string" },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
            }
        },
        AuthRegister: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Admin" },
            email: { type: "string", example: "admin@example.com" },
            rol: { type: "string", example: "admin" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "user" },
            email: { type: "string", example: "user@example.com" },
            rol: { type: "string", example: "user" }
          }
        },
        CreateUserDTO: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "string" },
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "string" }
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
        LoginDTO: {
          type: "object",
          required: ["name", "password"],
          properties: {
            name: { type: "string", example: "string" },
            password: { type: "string", example: "string" }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            name: { type: "string", example: "Antonio" },
            token: { type: "string", example: "eyJhbGciOi..." }
          }
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Juguetes" },
            description: { type: "string", example: "Juegos y juguetes para niños" }
          }
        },
        CategoryCreateDTO: {
          type: "object",
          required: ["name", "description"],
          properties: {
            name: { type: "string", example: "string" },
            description: { type: "string", example: "string" }
          }
        },
        CategoryUpdateDTO: {
          type: "object",
          properties: {
            name: { type: "string", example: "string" },
            description: { type: "string", example: "string" }
          }
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "educativo" }
          }
        },
        TagCreateDTO: {
          required: ["name"],
          type: "object",
          properties: {
            name: { type: "string", example: "string" }
          }
        },
        Product: { 
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Puzzle 3D" },
            slug: { type: "string", example: "puzzle-3d" },
            description: { type: "string", example: "Puzzle 3D para niños" },
            ageRange: { type: "integer", example: 6 },
            price: { type: "number", format: "float", example: 19.99 },
            stock: { type: "integer", example: 10 },
            sku: { type: "string", example: "SKU12345" },
            category: { $ref: "#/components/schemas/Category" },
            tags: {
              type: "array",
              items: { $ref: "#/components/schemas/Tag" }
            }
          }
        },
        ProductCreateDTO: {
          type: "object",
          required: ["name", "description", "price", "stock", "sku", "categoryId"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ageRange: { type: "integer" },
            price: { type: "number", format: "float" },
            stock: { type: "integer" },
            sku: { type: "string" },
            categoryId: { type: "integer" },
            tags: { type: "array", items: { type: "integer" }, description: "Array de IDs de Tag" }
          }
        },
        ProductUpdateDTO: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ageRange: { type: "integer" },
            price: { type: "number", format: "float" },
            stock: { type: "integer" },
            sku: { type: "string" },
            categoryId: { type: "integer" },
            tags: { type: "array", items: { type: "integer" } }
          }
        },
        ProductListResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
            meta: {
              type: "object",
              properties: {
                total: { type: "integer", example: 123 },
                limit: { type: "integer", example: 20 },
                page: { type: "integer", example: 1 },
                pages: { type: "integer", example: 7 }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

const specs = swaggerJSDoc(options);
export default specs;