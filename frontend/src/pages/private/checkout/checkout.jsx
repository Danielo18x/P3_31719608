import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../utils/useCart.jsx'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    paymentMethod: 'CreditCard',
    cardNumber: '',
    cvv: '',
    expiryMonth: '',
    expiryYear: '',
    currency: 'USD',
    description: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const items = useMemo(() => (cart || []).map((it) => ({ productId: it.id, quantity: it.quantity })), [cart])

  const validate = () => {
    if (!form.name.trim() || !form.email.trim()) return 'Completa nombre y correo.'
    const card = form.cardNumber.replace(/\s+/g, '')
    if (!/^\d{16}$/.test(card)) return 'Número de tarjeta inválido (16 dígitos).'
    if (!/^\d{3}$/.test(form.cvv)) return 'CVV inválido (3 dígitos).'
    const m = form.expiryMonth
    const y = form.expiryYear
    if (!/^\d{1,2}$/.test(m) || Number(m) < 1 || Number(m) > 12) return 'Mes inválido (01-12).'
    if (!/^\d{4}$/.test(y)) return 'Año inválido (4 dígitos).'
    if (!items || items.length === 0) return 'El carrito está vacío.'
    return ''
  }

  const handleCancel = () => {
    setForm({ name: '', email: '', paymentMethod: 'CreditCard', cardNumber: '', cvv: '', expiry: '', currency: 'USD', description: '' })
    clearCart()
    try { localStorage.removeItem('cart') } catch (e) {}
    navigate('/catalog')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    const API_BASE_URL = import.meta.env.MODE === 'development' 
      ? '/api' 
      //: 'http://localhost:3000'
      : 'https://p3-31719608.onrender.com';

    const payload = {
      Items: items,
      paymentMethod: form.paymentMethod,
      paymentDetails: {
        "card-number": form.cardNumber.replace(/\s+/g, ''),
        cvv: form.cvv,
        "expiration-month": form.expiryMonth.padStart(2,'0'),
        "expiration-year": form.expiryYear,
        "full-name": form.name,
        currency: form.currency,
        description: form.description,
        reference: "si"
      }
    }
    console.log(payload)

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const body = await res.json().catch(() => ({}))

      if (res.ok) {
        setSuccess('Pago Completado Exitosamente')
        clearCart()
        setTimeout(() => navigate('/dashboard'), 1500)
        return
      }

      // heurísticas para diferenciar errores
      const msg = (body && (body.message || body.error || JSON.stringify(body))) || `Error ${res.status}`
      if (/stock|existencia|out_of_stock|OUT_OF_STOCK/i.test(msg)) {
        setError('Error de stock: ' + (body.message || 'Algunos productos no tienen stock suficiente.'))
      } else if (/card|payment|tarjeta|declin/i.test(msg)) {
        setError('Fallo en el procesamiento del pago: ' + (body.message || 'Tarjeta rechazada.'))
      } else {
        setError('Error del servidor: ' + (body.message || `Código ${res.status}`))
      }

    } catch (err) {
      setError(err.message || 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Resumen */}
        <section className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow border border-white/30">
          <h2 className="text-2xl font-semibold text-purple-700">Total a Pagar</h2>
          <div className="mt-4 text-4xl font-bold text-purple-800">${total.toFixed(2)}</div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600">Resumen de Productos</h3>
            <ul className="mt-3 space-y-3">
              {cart && cart.length > 0 ? cart.map((it) => (
                <li key={it.id} className="flex items-start justify-between bg-white rounded-lg p-3 shadow-sm border border-white/30">
                  <div>
                    <div className="font-medium text-purple-700">{it.name}</div>
                    <div className="text-sm text-gray-500">Unidad: ${Number(it.price).toFixed(2)} · Cant: {it.quantity}</div>
                  </div>
                  <div className="font-semibold text-purple-800">${(Number(it.price) * it.quantity).toFixed(2)}</div>
                </li>
              )) : (
                <li className="text-gray-600">No hay productos en el carrito.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Panel Derecho - Formulario de Pago */}
        <section className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow border border-white/30">
          <h2 className="text-2xl font-semibold text-purple-700">Pagar</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nombre y Apellido</label>
              <input placeholder="Juan Pérez" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Correo</label>
              <input placeholder="juan@ejemplo.com" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} type="email" className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Método de Pago</label>
              <select value={form.paymentMethod} onChange={(e) => setForm((s) => ({ ...s, paymentMethod: e.target.value }))} className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none">
                <option value="CreditCard">CreditCard</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Número de Tarjeta</label>
                <input placeholder="1234123412341234" value={form.cardNumber} onChange={(e) => setForm((s) => ({ ...s, cardNumber: e.target.value.replace(/[^0-9]/g, '').slice(0,16) }))} inputMode="numeric" className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
              </div>

              <div>
                <label className="text-sm text-gray-600">CVV</label>
                <input placeholder="123" value={form.cvv} onChange={(e) => setForm((s) => ({ ...s, cvv: e.target.value.replace(/[^0-9]/g, '').slice(0,3) }))} inputMode="numeric" className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Mes / Año de expiración</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <input placeholder="MM" value={form.expiryMonth} onChange={(e) => setForm((s) => ({ ...s, expiryMonth: e.target.value.replace(/[^0-9]/g, '').slice(0,2) }))} inputMode="numeric" className="w-full p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
                <input placeholder="YYYY" value={form.expiryYear} onChange={(e) => setForm((s) => ({ ...s, expiryYear: e.target.value.replace(/[^0-9]/g, '').slice(0,4) }))} inputMode="numeric" className="w-full p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Moneda</label>
              <select value={form.currency} onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))} className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none">
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Descripción</label>
              <input placeholder="Pedido: Juego de construcción para cumpleaños" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className="w-full mt-1 p-2 rounded-lg bg-white/90 border border-purple-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>

            {error && <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{error}</div>}
            {success && <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">{success}</div>}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white">{loading ? 'Procesando...' : 'Pagar'}</button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800">Cancelar</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
