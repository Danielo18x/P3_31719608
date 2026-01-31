import { Link } from "react-router-dom";

export default function NavbarPublic() {
    return (
        <>
            <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] flex items-center justify-center overflow-hidden">
                    <img 
                        src="/logo.png" 
                        alt="icon" 
                        className="w-full h-full object-contain rounded-sm" 
                    />
                </div>
                <Link to="/" className="font-bold text-lg text-purple-700 tracking-wider">IMAGINARIUM</Link>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
                <Link to="/catalog" className="hover:underline">Catálogo</Link>
                <Link to="/login" className="text-purple-600 font-medium">Iniciar Sesión</Link>
                <Link to="/register" className="text-purple-600 font-medium">Registrarse</Link>    
            </div>
            
        </>
    )
}