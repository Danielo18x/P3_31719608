import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default class CategoryRepository {
    constructor(){
        this.model = prisma.category
    }

    async findAllCategory () {
        return await this.model.findMany();
    }

    async addCategory (data) {
        return await this.model.create({
            data: data
        });
    }

    async categoryUpdate (id, data) {
        return await this.model.update({
            where: {
                id: parseInt(id)
            }, 
            data: data
        });
    }

    async removeCategory (id) {
        return await this.model.delete({
            where: {
                id: parseInt(id)
            },
        });
    }

}