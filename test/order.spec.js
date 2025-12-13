import request from "supertest";
import { jest } from "@jest/globals";
import prisma from "../src/lib/prisma.js";
import app from "../src/app.js";
import { CreditCardPaymentStrategy } from "../src/services/strategies/paymentStrategy.js";
import OrdersRepository from "../src/repositories/orderRepository.js";

describe("Prueba de Integración de Order", () => {
    const agent = request.agent(app)
    const unique = Date.now();
    let testProduct
    let userAgent

    beforeAll(async () => {
        const category = await prisma.category.findFirst();
        testProduct = await prisma.product.create({
            data: {
                slug: `test-product-${unique}`,
                name: `test-product-${unique}`,
                description: "test product",
                categoryId: category.id,
                ageRange: 5,
                price: 20,
                stock: 10,
                sku: `TEST-PRODUCT-${unique}`
            },
        });

        userAgent = request.agent(app);
        await userAgent
            .post("/auth/login")
            .send({ name: "AdminTest", password: "admintest123" });
    })

    afterAll(async () => {
        const user = await prisma.user.findFirst({
            where: { name: "AdminTest" }
        });
        if (user) {
            const orders = await prisma.order.findMany({
                where: { userId: user.id },
            });
            if (orders.length > 0) {
                const orderIds = orders.map((o) => o.id);
                await prisma.orderItem.deleteMany({
                    where: { orderId: { in: orderIds } },
                });
                await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
            }
            await prisma.product.deleteMany({ where: { name: testProduct.name } });
        }
            await prisma.$disconnect();
    });

    test("Procesar pedido con estrategia de tarjeta de crédito y marcar como COMPLETED", async () => {
        const spy = jest
            .spyOn(CreditCardPaymentStrategy.prototype, "processPayment")
            .mockResolvedValue({ success: true, transactionId: "tx123" });

        const res = await userAgent.post("/orders").send({
            Items: [{ productId: testProduct.id, quantity: 2 }],
            paymentMethod: "CreditCard",
            paymentDetails: {
                "card-number": "4111111111111111",
                cvv: "123",
                "expiration-month": "01",
                "expiration-year": "2024",
                "full-name": "APROVED",
                currency: "USD",
                description: "cool stuff",
                reference: "si",
            },
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
        const order = res.body.data;
        expect(order.status).toBe("COMPLETED");

        const productAfter = await prisma.product.findUnique({
            where: { id: testProduct.id },
        });
        expect(productAfter.stock).toBe(testProduct.stock - 2);

        spy.mockRestore();
    });

    test("POST/orders debe devolver 401 cuando no estén autenticados", async () => {
        const res = await request(app)
            .post("/orders")
            .send({ Items: [{ productId: testProduct.id, quantity: 1 }] });
        expect(res.statusCode).toBe(401);
    });

    test("GET/orders debe devolver 401 cuando no estén autenticados", async () => {
        const res = await request(app).get("/orders")
        expect(res.statusCode).toBe(401);
    });

    test("GET/orders/id debe devolver 401 cuando no estén autenticados", async () => {
        const res = await request(app).get("/orders/1")
        expect(res.statusCode).toBe(401);
    });


    test("GET /orders debe devolver el historial de pedidos del usuario y la paginación de soporte", async () => {
        const res1 = await userAgent.post("/orders").send({
            Items: [{ productId: testProduct.id, quantity: 1 }],
        });
        const res2 = await userAgent.post("/orders").send({
            Items: [{ productId: testProduct.id, quantity: 1 }],
        });

        expect(res1.statusCode).toBe(200);
        expect(res2.statusCode).toBe(200);

        const list = await userAgent.get("/orders").send();
        expect(list.statusCode).toBe(200);
        expect(list.body.status).toBe("success");
        expect(list.body.data).toHaveProperty("items");
        expect(Array.isArray(list.body.data.items)).toBe(true);

        const page1 = await userAgent.get("/orders?page=1&limit=1").send();
        expect(page1.statusCode).toBe(200);
        expect(page1.body.data.items.length).toBeLessThanOrEqual(1);
    });

    test("GET /orders/:id acepta el token y rechaza a otros usuarios", async () => {
        
        const login = await request(app)
            .post("/auth/login")
            .send({ name: "AdminTest", password: "admintest123" });
        const cookie = login.headers["set-cookie"][0];

        const created = await request(app)
            .post("/orders")
            .set("Cookie", cookie)
            .send({ Items: [{ productId: testProduct.id, quantity: 1 }] });
        expect(created.statusCode).toBe(200);
        const orderId = created.body.data.id;

        const detail = await request(app)
            .get(`/orders/${orderId}`)
            .set("Cookie", cookie)
            .send();
        expect(detail.statusCode).toBe(200);

        
        const unique2 = Date.now();
        const newUser = {
            email: `other+${unique2}@example.com`,
            name: `other${unique2}`,
            password: "123456",
        };
        await request(app).post("/auth/register").send(newUser);
        const login2 = await request(app)
            .post("/auth/login")
            .send({ name: newUser.name, password: newUser.password });
        const cookie2 = login2.headers["set-cookie"][0];
        const prohibido = await request(app)
            .get(`/orders/${orderId}`)
            .set("Cookie", cookie2)
            .send();
        expect(prohibido.statusCode).toBe(403);
    });

    test("GET /orders/:id devuelve solo detalles del propietario", async () => {
        const created = await userAgent.post("/orders").send({
            Items: [{ productId: testProduct.id, quantity: 1 }],
        });
        expect(created.statusCode).toBe(200);
        const orderId = created.body.data.id;

        const detail = await userAgent.get(`/orders/${orderId}`).send();
        expect(detail.statusCode).toBe(200);
        expect(detail.body.status).toBe("success");
        expect(detail.body.data.id).toBe(orderId);
        expect(detail.body.data.Items[0]).toHaveProperty("product");

        const unique2 = Date.now();
        const newUser = {
            email: `other+${unique2}@example.com`,
            name: `other${unique2}`,
            password: "123456",
        };
        await request(app).post("/auth/register").send(newUser);
        const otherAgent = request.agent(app);
        const loginRes = await otherAgent
            .post("/auth/login")
            .send({ name: newUser.name, password: newUser.password });
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.headers["set-cookie"]).toBeDefined();

        const prohibido = await otherAgent.get(`/orders/${orderId}`).send();
        expect(prohibido.statusCode).toBe(403);
    });

    test("Debería revertirse y no crear un pedido cuando un producto no tiene suficiente stock", async () => {

        const category = await prisma.category.findFirst();
        const p1 = await prisma.product.create({
            data: {
                slug: `slugtest-product1-${unique}`,
                name: `test-product-${unique}`,
                description: "test product",
                categoryId: category.id,
                ageRange: 5,
                price: 20,
                stock: 5,
                sku: `TEST-PRODUCT${unique}-${unique}`
            },
        });
        const p2 = await prisma.product.create({
            data: {
                slug: `slugtest-product2-${unique}`,
                name: `test-product-${unique}`,
                description: "test product",
                categoryId: category.id,
                ageRange: 5,
                price: 20,
                stock: 5,
                sku: `TEST-PRODUCT2${unique}-${unique}`
            },
        });

        const res = await userAgent.post("/orders").send({
            Items: [
                { productId: p1.id, quantity: 1 },
                { productId: p2.id, quantity: 10 },
            ],
        });

        expect(res.statusCode).toBe(400);

        const orderItems = await prisma.orderItem.findMany({
            where: { productId: { in: [p1.id, p2.id] } },
        });
        expect(orderItems.length).toBe(0);

        const after1 = await prisma.product.findUnique({ where: { id: p1.id } });
        const after2 = await prisma.product.findUnique({ where: { id: p2.id } });
        expect(after1.stock).toBe(5);
        expect(after2.stock).toBe(5);

        await prisma.product.deleteMany({ where: { id: { in: [p1.id, p2.id] } } });
    });

    test("Debería revertirse la creación de pedidos y no disminuir el stock cuando falla el pago", async () => {
        const category = await prisma.category.findFirst();
        const p = await prisma.product.create({
            data: {
                slug: `slugtest-product-fail-${unique}`,
                name: `testproductfail${unique}`,
                description: "test product fail",
                categoryId: category.id,
                ageRange: 5,
                price: 20,
                stock: 5,
                sku: `TEST-PRODUCT-FAIL-${unique}`
            },
        });

        const spy = jest
            .spyOn(CreditCardPaymentStrategy.prototype, "processPayment")
            .mockResolvedValue({ success: false, error: "declined" });
            const deleteSpy = jest.spyOn(OrdersRepository.prototype, "deleteOrder");

        const res = await userAgent.post("/orders").send({
            Items: [{ productId: p.id, quantity: 2 }],
            paymentMethod: "CreditCard",
            paymentDetails: {
                "card-number": "4111111111111111",
                cvv: "123",
                "expiration-month": "01",
                "expiration-year": "2024",
                "full-name": "DECLINED",
                currency: "USD",
                description: "cool stuff",
            },
        });

        expect(res.statusCode).toBe(402);

        const beforeItems = await prisma.orderItem.findMany({
            where: { productId: p.id },
        });
        const items = await prisma.orderItem.findMany({
            where: { productId: p.id },
        });
        expect(items.length).toBe(beforeItems.length);

        const prodAfter = await prisma.product.findUnique({ where: { id: p.id } });
        expect(prodAfter.stock).toBe(5);

        spy.mockRestore();
        deleteSpy.mockRestore();

        await prisma.orderItem.deleteMany({ where: { productId: p.id } });
        await prisma.product.delete({ where: { id: p.id } });
    });

})
