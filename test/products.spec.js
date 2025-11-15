import request from "supertest";
import app from "../src/app.js";

const agent = request.agent(app);

describe("Peticiones de products con validaciones de token invalido", () => {
    test("Get by Id a products deberia devolver 401", async () => {
        const res = await agent.get("/products/3").send();
        expect(res.statusCode).toBe(401);
    });
    test("Post a products deberia devolver 401", async () => {
        const res = await agent.post("/products").send(
            {
                name: "Juego x",
                description: "descripcion x",
                categoryId: 1,
                ageRange: 7,
                price: 30.99,
                stock: 50,
                sku: "JUEGOX-001",
                tags: [10, 3, 7]
            });
        expect(res.statusCode).toBe(401);
    });
    test("Put a products deberia devolver 401", async () => {
        const res = await agent.put("/products/3").send(
            {
                name: "Juego y",
                description: "descripcion y",
                categoryId: 2,
                ageRange: 4,
                price: 1000.00,
                stock: 30,
                sku: "JUEGOX-002",
                tags: [5, 4, 2]
            });
        expect(res.statusCode).toBe(401);
    });
    test("delete a products deberia devolver 401", async () => {
        const res = await agent.delete("/products/3").send();
        expect(res.statusCode).toBe(401);
    });
});

describe("Peticiones de products públicas general y slug", () => {
    test("Get a products deberia devolver 200", async () => {
        const res = await agent.get("/products").send();
        expect(res.statusCode).toBe(200);
    });
    test("Get by slug a products deberia devolver 200", async () => {
        const res = await agent.get("/p/1-lego-star-wars-x-wing").send();
        expect(res.statusCode).toBe(200);
    });
    test("Get by slug a products deberia devolver 301", async () => {
        const res = await agent.get("/p/1-lego-star-wars-x").send();
        expect(res.statusCode).toBe(301);
    });
});

describe("Prueba de filtros en products", () => {
    test("get products by category devolver 200", async () => {
        const res = await agent.get("/products?category=1").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by tags devolver 200", async () => {
        const res = await agent.get("/products?tasg=2,6").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by search devolver 200", async () => {
        const res = await agent.get("/products?search=piezas").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by min_price, max_price devolver 200", async () => {
        const res = await agent.get("/products?price_min=80&price_max=150").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by ageRange devolver 200", async () => {
        const res = await agent.get("/products?ageRange=8").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by stock devolver 200", async () => {
        const res = await agent.get("/products?stock=20").send();
        expect(res.statusCode).toBe(200);
    });
    test("get products by sku devolver 200", async () => {
        const res = await agent.get("/products?sku=LEGO-001").send();
        expect(res.statusCode).toBe(200);
    });
});