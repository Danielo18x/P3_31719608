import {Router} from "express"
import { getTag, createTag, updateTag, deleteTag } from "../controllers/tagController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

/**
 * @swagger
 * tags:
 *   - name: Admin - Tags
 *     description: Gestión de tags (requiere JWT)
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     tags:
 *       - Admin - Tags
 *     summary: Listar tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getTag);

/**
 * @swagger
 * /tags:
 *   post:
 *     tags:
 *       - Admin - Tags
 *     summary: Crear tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagCreateDTO'
 *     responses:
 *       200:
 *         description: Tag creado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createTag);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     tags:
 *       - Admin - Tags
 *     summary: Actualizar tag
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
 *             $ref: '#/components/schemas/TagCreateDTO'
 *     responses:
 *       200:
 *         description: Tag actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags:
 *       - Admin - Tags
 *     summary: Eliminar tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tag eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteTag);

export default router;