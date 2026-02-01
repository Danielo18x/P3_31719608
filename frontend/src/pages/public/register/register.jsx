import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      /*const API_BASE_URL = import.meta.env.MODE === 'development' 
        ? '/api' 
        //: 'http://localhost:3000';
        : 'https://p3-31719608.onrender.com';*/



      const res = await fetch(`api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        navigate('/');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (err) {
      console.log(err)
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-lg mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-purple-700">Crear cuenta</h1>
          <p className="text-sm text-purple-600/80">Regístrate para empezar</p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded-md text-center mb-4 text-sm">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} aria-label="formulario de registro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@ejemplo.com"
              className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90"
              required
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90"
                  required
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.34 1.34A10.22 10.22 0 002.5 10c2.5 4 7.5 6 12 4a10.22 10.22 0 002.63-2.37l1.05 1.05a.75.75 0 101.06-1.06L4.03 3.97zM10 5a5 5 0 015 5c0 .88-.25 1.7-.68 2.39l1.26 1.26A7 7 0 0010 3a7 7 0 00-4.57 1.56l1.34 1.34A5.02 5.02 0 0110 5z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.94 6.94A10.97 10.97 0 0010 4c4.5 0 9.5 2 12 6-2.5 4-7.5 6-12 4a10.97 10.97 0 00-7.06-3.06zM10 8a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={formData.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.34 1.34A10.22 10.22 0 002.5 10c2.5 4 7.5 6 12 4a10.22 10.22 0 002.63-2.37l1.05 1.05a.75.75 0 101.06-1.06L4.03 3.97zM10 5a5 5 0 015 5c0 .88-.25 1.7-.68 2.39l1.26 1.26A7 7 0 0010 3a7 7 0 00-4.57 1.56l1.34 1.34A5.02 5.02 0 0110 5z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.94 6.94A10.97 10.97 0 0010 4c4.5 0 9.5 2 12 6-2.5 4-7.5 6-12 4a10.97 10.97 0 00-7.06-3.06zM10 8a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow-md hover:opacity-95 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">¿Ya tienes cuenta? <Link to="/login" className="text-purple-600 font-medium">Inicia sesión</Link></p>
      </div>
    </div>
  );
}









/*import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./register.css";

export default function Register() {
  // 1. Estado único para todo el formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: ''
  });

  console.log(formData);
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. Manejador de cambios dinámico
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Función para enviar los datos al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica de contraseñas
    if (formData.password !== formData.confirm) {
      return setError('Las contraseñas no coinciden');
    }

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`, // Unificamos nombre si tu API espera "name"
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include' // Obligatorio para recibir la COOKIE del backend
      });

      const data = await response.json();

      if (response.ok) {
        // Si el registro es exitoso, mandamos al catálogo
        navigate('/');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-lg mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-purple-700">Crear cuenta</h1>
          <p className="text-sm text-purple-600/80">Regístrate para empezar</p>
        </div>

        {/* Mostramos errores si existen */
      //}
        /*{error && <p className="bg-red-100 text-red-600 p-2 rounded-md text-center mb-4 text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nombre" 
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Apellido" 
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@ejemplo.com" 
              className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
              <input 
                type="password" 
                name="confirm" 
                value={formData.confirm}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/90" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow-md hover:opacity-95 transition">
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link to="/login" className="text-purple-600 font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}*/
