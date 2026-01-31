import React from "react";
import "../login/login.css";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/si.png")' }}>
        <section className="max-w-5xl w-full text-center py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 leading-tight"> IMAGINARIUM</h1>
          <p className="mt-4 text-lg text-purple-600/90 max-w-2xl mx-auto">Bienvenido a nuestro rincón de juegos: descubre juguetes llenos de imaginación y ternura.</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/login" className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow">Iniciar Sesión</Link>
            <Link to="/register" className="px-6 py-3 rounded-full bg-white/90 text-purple-700 font-medium border border-white/50 shadow-sm">Registro</Link>
          </div>
        </section>

        <section id="catalog" className="max-w-6xl w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div 
            className="w-full h-72 md:h-96 rounded-2xl bg-cover bg-center flex items-center justify-center border border-white/30 shadow-sm" style={{ backgroundImage: 'url("/carrito.png")' }}>
          </div>

          <div className="px-2 md:px-0">
            <h2 className="text-2xl font-bold text-purple-700">Explora nuestro catálogo</h2>
            <p className="mt-4 text-gray-700/90">Encuentra juguetes seleccionados con cariño para todas las edades. Calidad, seguridad y diversión en cada producto.</p>
            <div className="mt-6">
              <Link to="/catalog" className="inline-block px-5 py-3 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 text-purple-900 font-medium shadow-md">Ver catálogo</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
