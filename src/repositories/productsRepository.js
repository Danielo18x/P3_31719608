import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default class ProductsRepository {
    constructor(){
        this.model = prisma.product
    }

    async findAllProducts (options = {}) {
        const {
            page,
            category,
            tagsp,
            price_min,
            price_max,
            search,
            ageRange,
            stock,
            sku
        } = options;

        const where = {};
        const limit = 20;
        const pg = Math.max(1, parseInt(page) || 1);
        const skip = (pg - 1) * limit;

        //rango de edad

        if (ageRange !== undefined && ageRange !== null && ageRange !== "") {
            where.ageRange = {};
            const age = parseInt(ageRange, 10);
            if (!isNaN(age)) {
                where.ageRange.gte = age;
            }
        }

        //stock

        if (stock !== undefined && stock !== null && stock !== "") {
            where.stock = {};
            const stk = parseInt(stock, 10);
            if (!isNaN(stk)) {
                where.stock.gte = stk;
            }
        }

        //sku

        if (sku !== undefined && sku !== null && sku !== "") {
            where.sku = {
                contains: sku.toString(),
            };
        }

        if (category !== undefined && category !== null && category !== "") {
            const catId = parseInt(category);
            if (!isNaN(catId)) {
                where.categoryId = catId;
            } else {
                where.category = {
                name: { contains: category.toString() },
                };
            }
        }

        // Tags: accept comma separated string or array of ids
        if (tagsp !== undefined && tagsp !== null && tagsp !== "") {
            let ids = [];
            if (Array.isArray(tagsp)) {
                ids = tagsp.map((t) => parseInt(t)).filter((n) => !isNaN(n));
            }  else if (typeof tagsp === "string") {
                ids = tagsp
                .split(",")
                .map((t) => parseInt(t))
                .filter((n) => !isNaN(n));
            }
                
            if (ids.length > 0) {
                where.tags = { some: { tagId: { in: ids} } };
            }
        }

        // Price range
        if (
            (price_min !== undefined && price_min !== null && price_min !== "") ||
            (price_max !== undefined && price_max !== null && price_max !== "")
        ) {
            where.price = {};
            const pmin = parseInt(price_min);
            const pmax = parseInt(price_max);
            if (!isNaN(pmin)) where.price.gte = pmin;
            if (!isNaN(pmax)) where.price.lte = pmax;
        }

    // Search in name or description
        if (search !== undefined && search !== null && search !== "") {
            where.OR = [
                { name: { contains: search.toString() } },
                { description: { contains: search.toString() } },
            ];
        }

        const total = await this.model.count({ where });

        const items = await this.model.findMany({
            skip,
            take: limit,
            where,
            include: {
                tags: { include: { tag: true } },
                category: true,
            },
            orderBy: { id: "asc" },
        });

        return {
            items,
            meta: {
                total,
                limit: limit,
                page: pg,
                pages: Math.ceil(total / limit) || 0,
            },
        };

    
    }
    
    async addProduct (data) {
        return await this.model.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                ageRange: data.ageRange,
                price: data.price,
                stock: data.stock,
                sku: data.sku,
                category: { connect: { id: data.categoryId } },
                tags: {
                    create: data.tags.map(tagId => ({
                        tag: { connect: { id: tagId } }
                    }))
                }
            },
            include: { category: true, tags: { include: { tag: true } } }
        });
    }

    async findFirstProduct (id) {
        return await this.model.findFirst({
            where: {
                id: parseInt(id)
            },
            include: { category: true, tags: { include: { tag: true } } }
        });
    }
    
    async productUpdate (id, data) {
        return await this.model.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                ageRange: data.ageRange,
                price: data.price,
                stock: data.stock,
                sku: data.sku,
                ...(data.categoryId && {
                    category: { connect: { id: data.categoryId } }
                }),
                ...(data.tags && {
                    tags: {
                        deleteMany: {}, // solo se ejecuta si envías tags
                        create: data.tags.map(tagId => ({
                            tag: { connect: { id: tagId } }
                        }))
                    }
                }),
            },
            include: { category: true, tags: { include: { tag: true } } }
        });
    }

    async removeProduct (id) {
        await prisma.productTags.deleteMany({
            where: { productId: Number(id) }
        });
        return await this.model.delete({
            where: {
                id: parseInt(id)
            },
        });
    }

}