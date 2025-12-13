import {Router} from "express"
import { createOrder, getOrderById, getOrders} from "../controllers/orderController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Gestión de pedidos (requiere JWT)
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Crear un nuevo pedido
 *     description: Crea un pedido de forma transaccional. Incluye verificación de stock, procesamiento de pago y actualización de inventario. Requiere paymentMethod y paymentDetails en el body para procesar el pago.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateDTO'
 *     responses:
 *       200:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Stock insuficiente o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *                    example: "success"
 *                  message:
 *                    type:
 *                    example: "Productos no disponibles"
 *       402:
 *         description: Pago fallido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *                    example: "success"
 *                  message:
 *                    type:
 *                    example: "Error del proveedor (404): mensaje de error"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createOrder)

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listar pedidos del usuario
 *     description: Obtiene una lista paginada de pedidos del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *         description: Número de pedidos por página
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getOrders)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Obtener un pedido por ID
 *     description: Obtiene los detalles de un pedido específico del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *       403:
 *         description: Acceso denegado (pedido de otro usuario)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *                    example: "fail"
 *                  message:
 *                    type: string
 *                    example: "Acceso denegado"
 *       404:
 *         description: Order no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *                    example: "fail"
 *                  message:
 *                    type: string
 *                    example: "Order no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
*/ 
router.get('/:id', getOrderById)



export default router;
