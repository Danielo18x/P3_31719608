import OrderRepository from "../repositories/orderRepository.js"
import OrderService from "../services/orderService.js"
import jwt from "jsonwebtoken"

const orderRepository = new OrderRepository()
const orderService = new OrderService()

export async function createOrder(req, res) {
    try {
        if(!req.body.Items){
            return res.status(400).json({ status: "error", message: "No productos" })
        }

        //Obtener id del usuario
        let user
        try{
            const token = req.cookies.tokencito
            user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch (error) {
            return res.status(401).json({status: "error", message: "Acceso no autorizado"})
        }
        
        //armar data
        const Items = req.body.Items
        const data = {
            userId: user.id,
            items: Items,
            paymentMethod: req.body.paymentMethod,
            paymentDetails: req.body.paymentDetails
        }

        try{
            const order = await orderService.orderProcess(data)
            res.status(200).json({ status: "success", data: order });
        } catch (err){
            if (err && err.code === "PAGO_FALLIDO") {
                return res.status(402).json({
                    status: "fail",
                    message: err.message.replace(/^PAGO_FALLIDO:\s*/i, ""),
                });
            }
            if (err && err.code === "INSUFICIENTE_STOCK") {
                return res.status(400).json({
                    status: "fail",
                    message: err.message.replace(/^INSUFICIENTE_STOCK:\s*/i, ""),
                });
            }
            throw err;
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function getOrderById(req, res){
    try {
        const token = req.cookies.tokencito
        if (!token)
            return res.status(401).json({status: "error", message: "Acceso no autorizado"})
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(401).json({status: "error", message: "Acceso no autorizado"})
        }
        const orderById = await orderRepository.findFirstOrder(req.params.id);
        if (!orderById)
            return res
                .status(404)
                .json({ status: "fail", message: "Order no encontrada" });
        if (orderById.userId !== parseInt(user.id, 10))
            return res.status(403).json({ status: "fail", message: "Acceso denegado" });
        
        res.status(200).json({ status: "success", data: orderById });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function getOrders(req, res) {
    try {
        let user
        try{
            const token = req.cookies.tokencito
            user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch (error) {
            return res.status(401).json({status: "error", message: "Acceso no autorizado"})
        }
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const usId = parseInt(user.id, 10);

        const orders = await orderRepository.findOrders(usId, page, limit);
        res.status(200).json({status: "success", data: orders})
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}




