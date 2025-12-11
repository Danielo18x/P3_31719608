import prisma  from '../lib/prisma.js'
export default class ProductsRepository {
    constructor(){
        this.model = prisma.product
    }

    async findAllProducts (query) {
        const {prismaQuery, meta} = query;
        const total = await this.model.count({ where: prismaQuery.where });
        const items = await this.model.findMany(prismaQuery);

        return {
            items,
            meta: {
                total,
                limit: prismaQuery.take,
                page: meta.page,
                pages: Math.ceil(total / prismaQuery.take)
            }
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
                        deleteMany: {},
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