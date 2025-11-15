import express, {json, urlencoded} from "express" 
import {join, dirname} from "path" 

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

import specs from "../swagger/swagger.js";
import "dotenv/config";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express(); 
app.disable("x-powered-by");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.use("/api-docs", swagger.serve, swagger.setup(specs));
app.use('/about', aboutRouter);
app.use('/ping', pingRouter);
app.use('/users', userRouter);
app.use('/auth', registerRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/', productsRouter);
export default app
