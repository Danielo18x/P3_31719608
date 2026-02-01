import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../../utils/useCart.jsx'
import CarritoPanel from '../../../components/Cart/CarritoPanel.jsx'

const CATEGORIES = [
  'Juegos de construcción',
  'Vehiculos y Pistas',
  'Arte y manualidades',
  'Peluches y muñecos',
  'Juguetes educativos',
  'Juguetes electrónicos e interactivos',
  'Juegos de mesa y cartas',
  'Disfraces y juego de roles',
  'Bebés y primera infancia',
  'Deportes y aire libre'
]

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // filtros (inputs controlados)
  const [searchInput, setSearchInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [stockMinInput, setStockMinInput] = useState('')
  const [ageMinInput, setAgeMinInput] = useState('')
  const [skuInput, setSkuInput] = useState('')

  // parámetros aplicados (se usan para la consulta)
  const [applied, setApplied] = useState({})

  // paginación
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

  // cards expandibles
  const [expanded, setExpanded] = useState({})
  const toggleExpanded = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }))

  // cantidad por producto (visibilidad y valor)
  const [qtyVisible, setQtyVisible] = useState({})
  const [qtyValue, setQtyValue] = useState({})
  const [qtyError, setQtyError] = useState({})

  const { addItem, cart, setIsOpen } = useCart()

  const itemsCount = (cart || []).reduce((s, it) => s + (it.quantity || 0), 0)

  const openQty = (key) => setQtyVisible((s) => ({ ...s, [key]: true }))
  const closeQty = (key) => setQtyVisible((s) => ({ ...s, [key]: false }))

  const handleConfirmAdd = (product) => {
    const key = product.id || product.sku
    const qty = Number(qtyValue[key])
    if (!qty || !Number.isFinite(qty) || qty < 1) {
      setQtyError((s) => ({ ...s, [key]: 'Cantidad inválida' }))
      setTimeout(() => setQtyError((s) => ({ ...s, [key]: undefined })), 2500)
      return
    }

    const res = addItem(product, qty)
    if (!res.ok) {
      setQtyError((s) => ({ ...s, [key]: res.message || 'Error' }))
      setTimeout(() => setQtyError((s) => ({ ...s, [key]: undefined })), 2500)
      return
    }

    setQtyValue((s) => ({ ...s, [key]: '' }))
    closeQty(key)
    setIsOpen(true)
  }

  const buildQuery = (params) => {
    const q = new URLSearchParams()
    if (params.search) q.append('search', params.search)
    if (params.category) q.append('category', params.category)
    if (params.minPrice) q.append('price_min', params.minPrice)
    if (params.maxPrice) q.append('price_max', params.maxPrice)
    if (params.stock) q.append('stock', params.stock)
    if (params.ageMin) q.append('ageRange', params.ageMin)
    if (params.sku) q.append('sku', params.sku)
    q.append('page', params.page || 1)
    q.append('limit', params.limit || limit)
    return q.toString()
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const params = { ...applied, page, limit }
        const qs = buildQuery(params)
        const res = await fetch(`api/products?${qs}`)
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const payload = await res.json()
        // La API responde { data: [...] } según ejemplo; también puede devolver { items, total }.
        let raw = []
        let total = undefined
        if (payload && Array.isArray(payload.data)) {
          raw = payload.data
          total = payload.total ?? payload.meta?.total ?? payload.meta?.count
        } else if (payload && Array.isArray(payload.items)) {
          raw = payload.items
          total = payload.total ?? payload.meta?.total
        } else if (Array.isArray(payload)) {
          raw = payload
        }

        const normalized = raw.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          sku: p.sku,
          tags: Array.isArray(p.tags) ? p.tags.map(t => (t.tag?.name ?? t.name)).filter(Boolean) : [],
          category: p.category?.name ?? (typeof p.category === 'string' ? p.category : '')
        }))

        setProducts(normalized)
        if (total) setTotalPages(Math.max(1, Math.ceil(total / limit)))
        else setTotalPages(Math.max(1, Math.ceil(normalized.length / limit)))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Error al cargar productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, page, limit])

  const applyFilters = () => {
    setPage(1)
    setApplied({
      search: searchInput.trim() || undefined,
      category: categoryInput || undefined,
      minPrice: minPriceInput || undefined,
      maxPrice: maxPriceInput || undefined,
      stock: stockMinInput || undefined,
      ageMin: ageMinInput || undefined,
      sku: skuInput || undefined,
    })
  }

  const resetFilters = () => {
    setSearchInput('')
    setCategoryInput('')
    setMinPriceInput('')
    setMaxPriceInput('')
    setStockMinInput('')
    setAgeMinInput('')
    setSkuInput('')
    setApplied({})
    setPage(1)
  }

  // derivar la lista que mostramos (si backend ya paginó, products es página actual)
  const shown = products || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-purple-700">Catálogo de Juguetes</h1>
          <p className="text-sm text-gray-600 mt-1">Encuentra juguetes por categoría, edad y más.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <aside className="md:col-span-1 bg-white/60 backdrop-blur-md rounded-xl p-4 shadow border border-white/30">
            <h2 className="text-lg font-semibold text-purple-700 mb-3">Filtros</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Buscar</label>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Nombre o descripción" className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Categoría</label>
                <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none">
                  <option value="">Todas</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Precio min</label>
                  <input value={minPriceInput} onChange={(e) => setMinPriceInput(e.target.value)} type="number" className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Precio max</label>
                  <input value={maxPriceInput} onChange={(e) => setMaxPriceInput(e.target.value)} type="number" className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Stock mínimo</label>
                <input value={stockMinInput} onChange={(e) => setStockMinInput(e.target.value)} type="number" className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" placeholder="0" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Edad mínima</label>
                <input value={ageMinInput} onChange={(e) => setAgeMinInput(e.target.value)} type="number" className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" placeholder="Edad mínima" />
              </div>
              <div>
                <label className="text-sm text-gray-600">SKU</label>
                <input value={skuInput} onChange={(e) => setSkuInput(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 focus:outline-none" placeholder="Buscar por SKU" />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={applyFilters} className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white">Aplicar</button>
                <button onClick={resetFilters} className="px-3 py-2 rounded-lg bg-purple-100 text-purple-800">Limpiar</button>
              </div>
            </div>
          </aside>
          <main className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12 text-gray-600">Cargando productos...</div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shown.length === 0 && (
                    <div className="col-span-full text-center text-gray-600 py-12">No se encontraron productos.</div>
                  )}
                  {shown.map((p) => (
                    <article key={p.id || p.sku} className="bg-white/90 rounded-xl p-4 shadow border border-white/30">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-purple-700">{p.name}</h3>
                          <div className="text-sm text-gray-600">{p.category}</div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-xl font-bold text-purple-800">${p.price}</div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.stock > 0 ? 'En stock' : 'Agotado'}</div>
                          </div>
                        </div>
                      </div>

                      <div className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${expanded[p.id || p.sku] ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                        <div className="mt-3 text-sm text-gray-700">
                          <p>{p.description}</p>
                          {p.tags && p.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {p.tags.map((t) => <span key={t} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">#{t}</span>)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <button onClick={() => toggleExpanded(p.id || p.sku)} className="text-sm text-purple-600 hover:underline">{expanded[p.id || p.sku] ? 'Ver menos' : 'Ver más'}</button>

                          {/*Boton de agregar*/}
                          <div className="flex items-center gap-2">
                            {!qtyVisible[p.id || p.sku] ? (
                            <button onClick={() => openQty(p.id || p.sku)} className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-3 py-1 rounded-lg text-sm">Agregar</button>
                            ) : (
                            <div className="flex items-center gap-2">
                                <input
                                value={qtyValue[p.id || p.sku] || ''}
                                onChange={(e) => setQtyValue((s) => ({ ...s, [p.id || p.sku]: e.target.value }))}
                                type="number"
                                min={1}
                                className="w-20 p-1 rounded-md bg-white/90 border-0 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none"
                                placeholder="1"
                                />
                                <button onClick={() => handleConfirmAdd(p)} className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm">OK</button>
                                <button onClick={() => { closeQty(p.id || p.sku); setQtyValue((s) => ({ ...s, [p.id || p.sku]: '' })); }} className="px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-sm">X</button>
                            </div>
                            )}
                        </div>
                      </div>

                      {qtyError[p.id || p.sku] && (
                        <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-1 rounded">{qtyError[p.id || p.sku]}</div>
                      )}
                    </article>
                  ))}
                </div>

                {/* Paginación */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white/90 text-purple-700 font-medium shadow-sm hover:shadow-md border border-transparent hover:border-purple-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span className="text-lg leading-none">‹</span>
                    <span>Anterior</span>
                  </button>

                  <div className="text-sm text-gray-600">Página {page} / {totalPages}</div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/90 text-purple-700 font-medium shadow-sm hover:shadow-md border border-transparent hover:border-purple-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>Siguiente</span>
                    <span className="text-lg leading-none"> </span>
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      {/* Botón flotante del carrito */}
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 bg-white/90 rounded-full p-3 shadow-lg flex items-center gap-2 border border-white/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        {itemsCount > 0 && <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5">{itemsCount}</span>}
      </button>

      <CarritoPanel />
    </div>
  )
}
