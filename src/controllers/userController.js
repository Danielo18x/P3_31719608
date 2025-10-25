import {PrismaClient} from "@prisma/client"
import bcrypt from "bcrypt"

const prisma =  new PrismaClient()

export async function getUser(req, res) {
    try{
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error){
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function getUserById(req, res) {
    try {
        const userById = await prisma.user.findFirst({
            where: {
                id: parseInt(req.params.id)
            },
        });
        res.status(200).json(userById)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function createUser(req, res){
    try {
        req.body.password = await bcrypt.hash(req.body.password.toString(), 10)
        const createdUser = await prisma.user.create({
            data: req.body
        })
        res.status(200).json(createdUser)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function updateUser(req, res) {
    try {
        const userUpdate = await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: req.body,
        });
        res.status(200).json(userUpdate)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function deleteUser(req, res) {
    try {
        const userDelete = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id)
            },
        });
        res.status(200).json(userDelete)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}