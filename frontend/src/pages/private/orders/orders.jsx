import React, { useEffect, useState } from 'react'

// Historial de Órdenes - vista privada
// Consume GET /orders y muestra lista paginada de órdenes
export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // paginación sencilla
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [totalPages, setTotalPages] = useState(1)

  // track expandido por orderId
  const [expanded, setExpanded] = useState({})
  const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }))


  useEffect(() => {
    const controller = new AbortController()
    const fetchOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const qs = new URLSearchParams({ page: String(page), limit: String(limit) })
        const res = await fetch(`api/orders?${qs.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const body = await res.json()
        console.log(body)

        // Normalizar respuesta: soporta { data: [...] }, { items: [...] } o array
        let raw = []
        let total = undefined
        if (body && Array.isArray(body.data.items)) {
          raw = body.data.items
          total = body.data.meta.total
        }
        console.log(raw)

        setOrders(raw)
        if (total) setTotalPages(Math.max(1, Math.ceil(total / limit)))
        else setTotalPages(Math.max(1, 1))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Error al cargar órdenes')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Cabecera */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-purple-700">Historial de Órdenes</h1>
          <p className="text-sm text-gray-600 mt-1">Aquí puedes consultar tus compras anteriores. Haz clic en "Ver más" para expandir los detalles.</p>
        </header>

        {loading ? (
          <div className="text-center py-12 text-gray-600">Cargando órdenes...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="text-center text-gray-600 py-12">No se encontraron órdenes.</div>
            )}

            {orders.map((o) => {
              const id = o.id
              const status = o.status
              const total = o.totalAmount
              const items = o.Items ?? []

              return (
                <article key={id} className="w-full bg-white/90 rounded-xl p-4 shadow border border-white/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Orden</div>
                      <div className="font-medium text-purple-700">#{id}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-lg font-semibold text-purple-800">${Number(total).toFixed(2)}</div>
                    </div>

                    <div className="ml-4">
                      <button onClick={() => toggle(id)} className="text-sm text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-100 rounded px-2 py-1">{expanded[id] ? 'Ver menos' : 'Ver más'}</button>
                    </div>

                    <div className="ml-4">
                      {/* Badge de estado */}
                      {status === 'PENDING' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-800">PENDIENTE</span>
                      ) : status === 'COMPLETED' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-800">COMPLETADO</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-800">{status || 'UNKNOWN'}</span>
                      )}
                    </div>
                  </div>

                  {/* Detalle expandible */}
                  <div className={`mt-3 overflow-hidden transition-[max-height] duration-300 ${expanded[id] ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="font-medium text-gray-600 mb-2">Productos</div>
                      {items.length === 0 ? (
                        <div className="text-gray-600">No hay items registrados.</div>
                      ) : (
                        <ul className="space-y-2">
                          {items.map((it, idx) => {
                            const prod = it.product ?? it.Product ?? null
                            const name = prod?.name ?? it.name ?? it.productName ?? it.title
                            const unit = Number(it.unitPrice ?? it.price ?? prod?.price ?? 0)
                            const qty = it.quantity ?? it.qty ?? 1
                            return (
                              <li key={idx} className="flex items-center justify-between bg-white rounded-lg p-2 border border-white/30">
                                <div>
                                  <div className="font-medium text-purple-700">{name}</div>
                                  <div className="text-xs text-gray-500">Unidad: ${unit.toFixed(2)}</div>
                                </div>
                                <div className="text-sm text-gray-700">Cant: {qty}</div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}

            {/* Paginación simple */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white/90 text-purple-700 font-medium shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50">Anterior</button>
              <div className="text-sm text-gray-600">Página {page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white/90 text-purple-700 font-medium shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
