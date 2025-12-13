import axios from "axios"

export class PaymentStrategy {
    async processPayment (paymentDetails){
        throw new Error ("Se debe implementar el proceso de pago")
    }
}

export class CreditCardPaymentStrategy extends PaymentStrategy {

    constructor(){
        super()
    }
    
    async processPayment(paymentDetails){
        try{
            const response = await axios.post(`https://fakepayment.onrender.com/payments`, paymentDetails, 
                {
                    headers: {
                        Authorization: `Bearer ${process.env.APYKEY_FAKEPAYMENT}`,
                        "Content-Type": "application/json"
                    }
                });
            const json = response.data

            if (json.success || json.approved) {
                return {
                    success: true,
                    transactionId: json.data.transactionId || json.id || null
                }
            }

            return {
                success: false,
                error: json.message || "Pago rechazado"
            }

        } catch (error) {
            // Axios lanza error cuando el status es 400 o 500
            const status = error.response?.status
            const message = error.response?.data?.message || "Error en el proveedor de pagos"

            return {
                success: false,
                error: `Error del proveedor (${status}): ${message}`
            }
    
        }
    }
}
