import request from "supertest";
import app from "../src/app.js";

const agent = request.agent(app);

describe("CRUD de categorias con validaciones de token invalido", () => {
    test("Obtener todas las Categorias deberia devolver 401", async () => {
        const res = await agent.get("/categories").send();
        expect(res.statusCode).toBe(401);
    });
    test("Crear una Categoria deberia devolver 401", async () => {
        const res = await agent.post("/categories").send({name:"categoria x", description:"descripcion x"});
        expect(res.statusCode).toBe(401);
    });
    test("Actualizar una Categoria deberia devolver 401", async () => {
        const res = await agent.put("/categories/3").send({name:"categoria y", description:"descripcion y"});
        expect(res.statusCode).toBe(401);
    });
    test("Eliminar una Categoria deberia devolver 401", async () => {
        const res = await agent.delete("/categories/3").send();
        expect(res.statusCode).toBe(401);
    });
});

describe("CRUD de categorias con validaciones de token válido", () => {
    test("El inicio de sesión con las credenciales correctas deberia de devolver 200", async () => {
        const res = await agent
            .post("/auth/login")
            .send({ name: "Antonio", password: "antonio123" });
        expect(res.statusCode).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
    });
    test("Obtener todas las Categorias deberia devolver 200", async () => {
        const res = await agent.get("/categories").send();
        expect(res.statusCode).toBe(200);
    });
    test("Crear una Categoria deberia devolver 200", async () => {
        const res = await agent.post("/categories").send({id: 3, name:`categoria ${Date.now().toString()}`, description:"descripcion x"});
        expect(res.statusCode).toBe(200);
    });
    test("Actualizar una Categoria deberia devolver 200", async () => {
        const res = await agent.put("/categories/3").send({name:"Misterio y Estrategia", description:"Juegos de mesa de misterio y estrategia"});
        expect(res.statusCode).toBe(200);
    });
    test("Eliminar una Categoria deberia devolver 200", async () => {
        const res = await agent.delete("/categories/3");
        expect(res.statusCode).toBe(200);
    });
});
