import ProductsRepository from "../repositories/productsRepository.js";
import ProductsBuilder from "../builders/productsQueryBuilder.js";
import generateSlug from "../../public/javascripts/slug.js"
const prodRepo = new ProductsRepository()

//Rutas públicas

export async function getProduct(req, res) {
    try {
        const builder = new ProductsBuilder()
            .setPagination(req.query.page)
            .filterByCategory(req.query.category)
            .filterByTags(req.query.tags)
            .filterByPrice(req.query.price_min, req.query.price_max)
            .filterBySearch(req.query.search)
            .filterByAge(req.query.ageRange)
            .filterByStock(req.query.stock)
            .filterBySku(req.query.sku);

        const query = builder.build();
        const result = await prodRepo.findAllProducts(query);

        return res.status(200).json({
            status: "success",
            data: result.items,
            meta: result.meta
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
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

