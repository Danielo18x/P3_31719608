import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import getNameFromCookie from '../../../utils/authUtils.js'

export default function Dashboard() {
  const [name, setName] = useState('Usuario')
  
  useEffect(() => {
    const name = getNameFromCookie();
    if (name) {
      setName(name); // Actualizas el estado de tu Navbar
  }
  }, [])

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <section className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow border border-white/30 flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center text-white text-3xl font-bold">
            {/* Icono usuario */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 22a8 8 0 0116 0" />
            </svg>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-purple-700">Bienvenido, {name}</h2>
            <p className="mt-2 text-gray-600">Accede rápidamente a las acciones principales desde aquí.</p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow border border-white/30 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-purple-700">Catálogo</h3>
              <p className="mt-2 text-gray-600">Ver o comprar productos</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link to="/catalog" className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-200 to-blue-200 text-purple-800 font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 border-0">Ir al Catálogo</Link>
              <span className="text-sm text-gray-500">Ver o comprar productos</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow border border-white/30 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-purple-700">Historial de Pedidos</h3>
              <p className="mt-2 text-gray-600">Ver historial de pedidos realizados</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link to="/orders" className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-200 to-blue-200 text-purple-800 font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 border-0">Ver Historial</Link>
              <span className="text-sm text-gray-500">Ver historial de pedidos realizados</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
