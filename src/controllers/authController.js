//import {PrismaClient} from "@prisma/client"
import AuthRepository from "../repositories/authRepository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//const prisma =  new PrismaClient()
const authRepo = new AuthRepository()

export async function register(req, res){
    try {
        
        req.body.password = await bcrypt.hash(req.body.password.toString(), 10)
        req.body.rol = "admin"
        const createdUser = await authRepo.registerUser(req.body);
        res.status(200).json(createdUser)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error creating user",
        })
    }
}

export async function login(req, res){
    const {name, password} = req.body

    try {
        const user = await authRepo.loginUser(name);
        if(!user){
            return res.status(400).json({
                status: "error",
                message: "user doesn't exist"
            })
        }
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid){
            return res.status(400).json({
                status: "error",
                message: "arong password"
            }) 
        }
        const token = jwt.sign(
            {name: user.name, id: user.id, rol : user.rol},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "1h"}
        );
        res
        .status(200)
        .cookie("tokencito", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .send({name, token});
    } catch (error) {
        res.status(400).json({errors: error})
    }
}