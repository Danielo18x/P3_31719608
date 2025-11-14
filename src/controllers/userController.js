import UserRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt"

const userRepo = new UserRepository()

export async function getUser(req, res) {
    try{
        const users = await userRepo.findAllUsers();
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
        const userById = await userRepo.findFirstUser(req.params.id);
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
        const createdUser = await userRepo.addUser(req.body);
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
        const putUser = await userRepo.userUpdate(req.params.id, req.body);
        res.status(200).json(putUser)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function deleteUser(req, res) {
    try {
        const userDelete = await userRepo.removeUser(req.params.id)
        res.status(200).json(userDelete)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}