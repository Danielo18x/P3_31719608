import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (e) {
      // ignore
    }
  }, [cart])

  const addItem = (product, quantity) => {
    const qty = Number(quantity)
    if (!product || !product.id && !product.sku) return { ok: false, message: 'Producto inválido' }
    if (!Number.isFinite(qty) || qty < 1) return { ok: false, message: 'Cantidad inválida' }

    setCart((prev) => {
      const key = product.id ?? product.sku
      const idx = prev.findIndex((it) => it.id === key)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
        return copy
      }
      return [...prev, {
        id: key,
        sku: product.sku,
        name: product.name,
        price: Number(product.price) || 0,
        quantity: qty
      }]
    })

    return { ok: true }
  }

  const removeItem = (id) => setCart((prev) => prev.filter((it) => it.id !== id))
  const clearCart = () => setCart([])

  const total = useMemo(() => cart.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 0), 0), [cart])

  const value = {
    cart,
    addItem,
    removeItem,
    clearCart,
    total,
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen((v) => !v)
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default useCart
