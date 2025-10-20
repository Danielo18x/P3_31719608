import express, {json, urlencoded} from "express" // Importa Express (framework HTTP) y helpers para parseo
import {join, dirname} from "path" // Importa utilidades para construir rutas de archivos
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser" // Middleware para parsear cookies de las peticiones
import logger from "morgan" //Middleware para registrar peticiones HTTP en la consola

import aboutRouter from "../src/routes/about.js"// Importa el enrutador para la ruta raíz ('/')
import pingRouter from "../src/routes/ping.js" // Importa el enrutador para la ruta '/users'

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express(); // Crea la aplicación Express
app.disable("x-powered-by");

// Registra el middleware de logging (morgan) en modo 'dev' para mostrar info de cada petición
app.use(logger('dev'));
// Middleware para parsear bodies JSON en las peticiones y dejar disponibles los datos en req.body
app.use(express.json());
// Middleware para parsear bodies codificados en URL (form submissions)
// extended: false => usa querystring; true => usa qs para parseo más avanzado
app.use(express.urlencoded({ extended: false }));

// Middleware para parsear cookies y añadirlas en req.cookies
app.use(cookieParser());

// Middleware que sirve archivos estáticos desde la carpeta ../public (respecto a __dirname)
app.use(express.static(join(__dirname, '../public')));

app.use('/about', aboutRouter);
app.use('/ping', pingRouter);
// Exporta la instancia de la app para que pueda ser usada por el servidor (bin/www u otro)
export default app
