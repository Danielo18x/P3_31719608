import {Router} from "express"
import { getAbout } from "../controllers/aboutController.js";
var router = Router();

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Obtiene información de la aplicación/autor
 *     description: Devuelve los datos descriptivos cargados desde services/about.json.
 *     tags:
 *       - Información
 *     responses:
 *       200:
 *         description: Información de la aplicación en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: "Danilo Antonio Marin Lombano"
 *                     cedula:
 *                       type: string
 *                       example: "31719608"
 *                     seccion:
 *                       type: string
 *                       example: "2"
 *       500:
 *         description: Error interno del servidor al obtener los datos.
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
 *                   example: "Error interno del servidor al obtener los datos."
 */
router.get('/', getAbout);

export default router;
