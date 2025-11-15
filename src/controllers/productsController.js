import ProductsRepository from "../repositories/productsRepository.js";
import generateSlug from "../../public/javascripts/slug.js"
const prodRepo = new ProductsRepository()

//Rutas públicas

export async function getProduct(req, res) {
    try{
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const category = req.query.category;
        const tagsp = req.query.tags;
        const price_min = req.query.price_min;
        const price_max = req.query.price_max;
        const search = req.query.search;
        const ageRange = req.query.ageRange;
        const stock = req.query.stock;
        const sku = req.query.sku;

        const result = await prodRepo.findAllProducts({
            page,
            category,
            tagsp,
            price_min,
            price_max,
            search,
            ageRange,
            stock,
            sku
        });

        return res.status(200).json({
            status: "success",
            data: result.items,
            meta: result.meta,
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function publicProduct(req, res) {
    const {id, slug} = req.params
    try {
        const product = await prodRepo.findFirstProduct(id);
        if (!product) {
            return res
                .status(404)
                .json({ status: "fail", message: "Product not found" });
        }
        if(product.slug !== slug){
            return res.redirect(301, `/p/${product.id}-${product.slug}`)
        }
        res.status(200).json({status: "success", data: product})
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function createProduct(req, res) {
    try {
        req.body.slug = generateSlug(req.body.name);
        const createdProduct= await prodRepo.addProduct(req.body);
        res.status(200).json(createdProduct);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function getProductById(req, res) {
    try {
        const productById = await prodRepo.findFirstProduct(req.params.id);
        res.status(200).json(productById)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function updateProduct(req, res) {
    try {
        if(req.body.name) {
            req.body.slug = generateSlug(req.body.name);
        }
        const putProduct = await prodRepo.productUpdate(req.params.id, req.body);
        res.status(200).json(putProduct)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function deleteProduct(req, res) {
    try {
        const deletedProduct = await prodRepo.removeProduct(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

