import prisma  from '../lib/prisma.js'
export default class TagRepository {
    constructor(){
        this.model = prisma.tag
    }

    async findAllTag () {
        return await this.model.findMany();
    }

    async addTag (data) {
        return await this.model.create({
            data: data
        });
    }

    async tagUpdate (id, data) {
        return await this.model.update({
            where: {
                id: parseInt(id)
            }, 
            data: data
        });
    }

    async removeTag (id) {
        return await this.model.delete({
            where: {
                id: parseInt(id)
            },
        });
    }

}