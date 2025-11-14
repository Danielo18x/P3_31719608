import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default class UserRepository {
    constructor(){
        this.model = prisma.user
    }

    async findAllUsers () {
        return await this.model.findMany();
    }

    async findFirstUser (id) {
        return await this.model.findFirst({
            where: {
                id: parseInt(id)
            },
        });
    }

    async addUser (data) {
        return await this.model.create({
            data: data
        });
    }

    async userUpdate (id, data) {
        return await this.model.update({
            where: {
                id: parseInt(id)
            }, 
            data: data
        });
    }

    async removeUser (id) {
        return await this.model.delete({
            where: {
                id: parseInt(id)
            },
        });
    }

}