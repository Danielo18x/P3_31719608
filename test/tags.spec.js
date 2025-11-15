import request from "supertest";
import app from "../src/app.js";

const agent = request.agent(app);

describe("CRUD de tags con validaciones de token invalido", () => {
    test("Obtener todas las Tags deberia devolver 401", async () => {
        const res = await agent.get("/tags").send();
        expect(res.statusCode).toBe(401);
    });
    test("Crear una Tag deberia devolver 401", async () => {
        const res = await agent.post("/tags").send({name:"tag x"});
        expect(res.statusCode).toBe(401);
    });
    test("Actualizar una Tag deberia devolver 401", async () => {
        const res = await agent.put("/tags/11").send({name:"tag y"});
        expect(res.statusCode).toBe(401);
    });
    test("Eliminar una Tag deberia devolver 401", async () => {
        const res = await agent.delete("/tags/11").send();
        expect(res.statusCode).toBe(401);
    });
});

describe("CRUD de tags con validaciones de token válido", () => {
    test("El inicio de sesión con las credenciales correctas deberia de devolver 200", async () => {
        const res = await agent
            .post("/auth/login")
            .send({ name: "Antonio", password: "antonio123" });
        expect(res.statusCode).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
    });
    test("Obtener todas las Tags deberia devolver 200", async () => {
        const res = await agent.get("/tags").send();
        expect(res.statusCode).toBe(200);
    });
    test("Crear una Tag deberia devolver 200", async () => {
        const res = await agent.post("/tags").send({id: 11, name:`tag ${Date.now().toString()}`});
        expect(res.statusCode).toBe(200);
    });
    test("Actualizar una Tag deberia devolver 200", async () => {
        const res = await agent.put("/tags/11").send({name:"Tag Actualizada"});
        expect(res.statusCode).toBe(200);
    });
    test("Eliminar una Tag deberia devolver 200", async () => {
        const res = await agent.delete("/tags/11");
        expect(res.statusCode).toBe(200);
    });
});