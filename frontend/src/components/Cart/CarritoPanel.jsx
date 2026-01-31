import React, { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { useCart } from '../../utils/useCart'

export default function CarritoPanel() {
  const { cart, removeItem, clearCart, total, isOpen, setIsOpen } = useCart()
  const [showToast, setShowToast] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(''), 3000)
    return () => clearTimeout(t)
  }, [showToast])

  const handleBuy = () => {
    if (!cart || cart.length === 0) {
      setShowToast('El carrito está vacío')
      return
    }
    // Navegar al checkout
    navigate('/checkout')
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* drawer */}
      <aside className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-purple-700">Tu carrito</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-auto">
            {cart.length === 0 ? (
              <div className="text-center text-gray-600 py-12">No hay productos en el carrito.</div>
            ) : (
              <ul className="space-y-4">
                {cart.map((it) => (
                  <li key={it.id} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-white/40">
                    <div className="flex-1">
                      <div className="font-medium text-purple-700">{it.name}</div>
                      <div className="text-sm text-gray-500">Unidad: ${it.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-600 mt-1">Cant: {it.quantity} · Subtotal: <span className="font-semibold text-purple-800">${(it.price * it.quantity).toFixed(2)}</span></div>
                    </div>
                    <div className="ml-3">
                      <button onClick={() => removeItem(it.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex items-baseline justify-between">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-purple-800">${total.toFixed(2)}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={handleBuy} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white">Comprar</button>
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800">Cancelar</button>
            </div>
          </div>

          {showToast && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-purple-50 text-purple-800 px-4 py-2 rounded-full shadow">
              {showToast}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
