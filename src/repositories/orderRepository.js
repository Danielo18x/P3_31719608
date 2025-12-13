import prisma from "../lib/prisma.js"
//console.log(Object.keys(prisma));
export default class OrderRepository {
    constructor(){
        this.model = prisma.order;
    }

    async createOrder(data){
        let total = 0
        data.items.forEach(i => {
            total+= i.price * i.quantity
        });

        return await this.model.create({
            data: {
                userId: data.userId,
                totalAmount: total,
                status: "PENDING",
                Items: {
                    createMany: {
                        data: data.items.map(i => ({
                            productId: i.id,
                            quantity: i.quantity,
                            unitPrice: i.price
                        }))
                    }
                }
            },
            include: {
                Items: {include: {product: true}}
            }
        })
    }

    async updateOrder(data){
        return await this.model.update({
            where:{
                id: parseInt(data.id)
            },
            data: data.body,
            include: { Items: {include: { product: true }}},
        })
    }

    async findFirstOrder(id){
        return await this.model.findFirst({
            where: {
                id: parseInt(id)
            },
            include: { Items: {include: { product: true }}},
        })
    }

    async deleteOrder(id) {
        await prisma.orderItem.deleteMany({ where: { orderId: parseInt(id) } });
        return await this.model.delete({ where: { id: parseInt(id) } });
    }

    async findOrders(userId, page = 1, limit = 20 ){
        const pg = Math.max(1, parseInt(page) || 1);
        const lim = Math.max(1, parseInt(limit) || 20);
        const skip = (pg - 1) * lim;

        const where = { userId: parseInt(userId) };
        const total = await this.model.count({ where });
        const items = await this.model.findMany({
            where: where,
            skip,
            take: lim,
            include: { Items: { include: { product: true } } },
            orderBy: { id: "desc" },
        });

        return {
            items,
            meta: { total, limit: lim, page: pg, pages: Math.ceil(total / lim) || 0 },
        };
    }


}