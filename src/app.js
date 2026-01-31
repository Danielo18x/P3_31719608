import express, {json, urlencoded} from "express" 
import {join, dirname} from "path"
import path from "path"

import { fileURLToPath } from "url";
import cookieParser from "cookie-parser" 
import logger from "morgan" 
import swagger from "swagger-ui-express";

import aboutRouter from "../src/routes/about.js"
import pingRouter from "../src/routes/ping.js" 
import userRouter from "../src/routes/user.js"
import registerRouter  from "../src/routes/auth.js";
import categoriesRouter from "../src/routes/categories.js"
import tagsRouter from "../src/routes/tags.js"
import productsRouter from "../src/routes/products.js"
import ordersRouter from "../src/routes/order.js"
import cors from "cors";

import specs from "../swagger/swagger.js";
import "dotenv/config";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express(); 
app.disable("x-powered-by");

app.use(
    cors({
        origin: true,
        credentials: true,
    })
)
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de tu frontend
  credentials: true // Necesario para las cookies que mencionaste
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(join(__dirname, '../public')));

const buildPath = path.join(__dirname, '../frontend/dist');
    
app.use(express.static(buildPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
})
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/catalog', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.use("/api-docs", swagger.serve, swagger.setup(specs));
app.use('/about', aboutRouter);
app.use('/ping', pingRouter);
app.use('/users', userRouter);
app.use('/auth', registerRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/', productsRouter);
app.use('/orders', ordersRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});
export default app
