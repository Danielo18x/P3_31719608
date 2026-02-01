import {Link} from "react-router-dom";
import { useEffect, useState } from 'react'
import getNameFromCookie from '../../utils/authUtils.js';

const handleLogout = () => {
  document.cookie = "tokencito=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/"; 
};


export default function NavbarPrivate() {
    const [name, setName] = useState('Usuario')
    useEffect(() => {
        const name = getNameFromCookie();
        if (name) {
          setName(name); // Actualizas el estado de tu Navbar
    }
    }, [])
    
    return(
        <>
            <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] flex items-center justify-center overflow-hidden">
                    <img 
                        src="/images/logo.png" 
                        alt="icon" 
                        className="w-full h-full object-contain rounded-sm" 
                    />
                </div>
                <Link to="/dashboard" className="font-bold text-lg text-purple-700 tracking-wider">IMAGINARIUM</Link>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
                <Link to="/catalog" className="hover:underline">Catálogo</Link>
                <Link to="/orders" className="text-purple-600 font-medium">Historial de Pedidos</Link>
                <Link to="/dashboard" className="text-purple-600 font-medium">{name}</Link> 
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Salir
                </button>       
            </div>
            
        </>
    )
}
