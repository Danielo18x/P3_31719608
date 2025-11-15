import {Router} from "express"
import { getProduct, publicProduct, getProductById, createProduct , updateProduct, deleteProduct} from "../controllers/productsController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

/**
 * @swagger
 * tags:
 *   - name: Public - Products
 *     description: Endpoints públicos para listar y ver productos
 *   - name: Admin - Products
 *     description: Endpoints administrativos para crear/editar/eliminar productos (requieren JWT)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Public - Products
 *     summary: Lista productos (público)
 *     description: Obtiene una lista paginada de productos. Soporta filtros avanzados.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Número de página (paginación)
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por id de categoría o por nombre (si es texto)
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *         description: "IDs de tags separados por comas (ej: \"1,2,3\") o array"
 *       - in: query
 *         name: price_min
 *         schema: { type: number }
 *         description: Precio mínimo
 *       - in: query
 *         name: price_max
 *         schema: { type: number }
 *         description: Precio máximo
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Búsqueda por nombre o descripción
 *       - in: query
 *         name: ageRange
 *         schema: { type: integer }
 *         description: Filtrar por rango de edad (gte)
 *       - in: query
 *         name: stock
 *         schema: { type: integer }
 *         description: Filtrar por stock mínimo (gte)
 *       - in: query
 *         name: sku
 *         schema: { type: string }
 *         description: Buscar por porción de SKU
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/products', getProduct);

/**
 * @swagger
 * /p/{id}-{slug}:
 *   get:
 *     tags:
 *       - Public - Products
 *     summary: Obtener un producto público por id y slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/p/:id-:slug', publicProduct);

router.use(valideUser);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Admin - Products
 *     summary: Crear un producto (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateDTO'
 *     responses:
 *       200:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/products', createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Admin - Products
 *     summary: Obtener producto por id (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - Admin - Products
 *     summary: Actualizar producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateDTO'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/products/:id', updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Admin - Products
 *     summary: Eliminar producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/products/:id', deleteProduct);

export default router;