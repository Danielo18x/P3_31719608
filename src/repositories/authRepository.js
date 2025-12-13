import prisma  from '../lib/prisma.js'

export default class AuthRepository {
    constructor(){
        this.model = prisma.user
    }

    async registerUser (data) {
        return await this.model.create({
            data: data
        });
    }

    async loginUser (name) {
        return await this.model.findFirst({
            where: {
                name: name
            },
        });
    }
}