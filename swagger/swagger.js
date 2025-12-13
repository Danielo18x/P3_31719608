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
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            orderId: { type: "integer", example: 10 },
            productId: { type: "integer", example: 1 },
            quantity: { type: "integer", example: 2 },
            unitPrice: { type: "number", format: "float", example: 19.99 },
            product: { $ref: "#/components/schemas/Product" }
          }
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 10 },
            userId: { type: "integer", example: 1 },
            totalAmount: { type: "number", format: "float", example: 39.98 },
            status: { type: "string", enum: ["PENDING", "COMPLETED"], example: "COMPLETED" },
            Items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } }
          }
        },
        OrderCreateDTO: {
          type: "object",
          required: ["Items"],
          properties: {
            Items: {
              type: "array",
              items: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {productId: { type: "integer", example: 0 }, quantity: { type: "integer", example: 0 }}
              }
            },
            paymentMethod: { type: "string", example: "CreditCard" },
            paymentDetails: {
              type: "object",
              properties: {
                "card-number": { type: "string", example: "1234123412341234" },
                cvv: { type: "string", example: "CVV" },
                "expiration-month": { type: "string", example: "MM" },
                "expiration-year": { type: "string", example: "AAAA" },
                "full-name": { type: "string", example: "string" },
                currency: { type: "string", example: "USD" },
                description: { type: "string", example: "string" },
                reference: { type: "string", example: "string" }
              }
            }
          }
        },
        OrdersListResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                meta: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 50 },
                    limit: { type: "integer", example: 20 },
                    page: { type: "integer", example: 1 },
                    pages: { type: "integer", example: 3 }
                  }
                }
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