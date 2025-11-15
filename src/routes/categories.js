import {Router} from "express"
import { getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

/**
 * @swagger
 * tags:
 *   - name: Admin - Categories
 *     description: Gestión de categorías (requiere JWT)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Admin - Categories
 *     summary: Listar categorías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Admin - Categories
 *     summary: Crear categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreateDTO'
 *     responses:
 *       200:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Admin - Categories
 *     summary: Actualizar categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdateDTO'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       
 */
router.put('/:id', updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Admin - Categories
 *     summary: Eliminar categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteCategory);

export default router;