import OrderRepository from "../repositories/orderRepository.js";
import ProductsRepository from "../repositories/productsRepository.js";
import { CreditCardPaymentStrategy } from "./strategies/paymentStrategy.js";

const productsRepository = new ProductsRepository()
const orderRepository = new OrderRepository()

export default class OrderService {
    constructor(){
        this.paymentStrategies = {
            CreditCard: CreditCardPaymentStrategy,
            creditcard: CreditCardPaymentStrategy,
            credit_card: CreditCardPaymentStrategy
        },
        this.prodRepo = productsRepository,
        this.orderRepo = orderRepository
    }

    async orderProcess (data){
        //Verificar Stock
        const products = await productsRepository.checkout(data.items)
        if(!products || products == false){
            const err = new Error("INSUFICIENTE_STOCK: Productos no disponibles")
            err.code = "INSUFICIENTE_STOCK"
            throw err
        }
        data.items = products

        //Crear Orden
        let order = await this.orderRepo.createOrder(data)

        //Realizar pago
        if(data.paymentDetails){

            data.paymentDetails.amount = order.totalAmount
            const method = (data.paymentMethod || "CreditCard").toString()
            const key = method.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_")
            const Strategy = this.paymentStrategies[key] || CreditCardPaymentStrategy
            const strategy = new Strategy()
                
            const payment = await strategy.processPayment(data.paymentDetails)

            console.log(payment)

            //Actualizar estado y stock
            if(payment.success){
                order = await this.orderRepo.updateOrder({
                    id: order.id,
                    body: {status: "COMPLETED"}
                })

                await Promise.all(
                    data.items.map((item) =>
                    this.prodRepo.productUpdate({
                        id: item.id,
                        stock: item.stock - item.quantity,
                    }))
                );
            }

            if (!payment.success) {
                const err = new Error(`PAGO_FALLIDO: ${payment.error}`);
                err.code = "PAGO_FALLIDO";
                throw err;
            }
        }
        return order
    }
}     