import {Router} from "express"
var router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Health check / comprobación de estado
 *     description: Endpoint simple para verificar que el servidor responde.
 *     tags:
 *       - Ping
 *     responses:
 *       200:
 *         description: Servicio activo (respuesta vacía)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ""
 */
router.get('/', (_req, res) => {
  res.status(200).send("");
});

export default router;
