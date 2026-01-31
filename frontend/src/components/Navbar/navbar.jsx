import NavbarPublic from "./navbarPublic.jsx";
import NavbarPrivate from "./navbarPrivate.jsx";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificamos la cookie cuando el componente se monta
        const hasToken = document.cookie.includes('tokencito');
        setIsAuthenticated(hasToken);
    }, []);
    return (
    <header className="sticky top-0 z-20 bg-white/40 backdrop-blur-md border-b border-white/30">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Aquí decidimos cuál mostrar dinámicamente */}
            {isAuthenticated ? <NavbarPrivate /> : <NavbarPublic />}
        <div className="md:hidden">
            <button className="px-3 py-2 rounded bg-white/60 border border-white/30">Menu</button>
        </div>
        </nav>
    </header>
    );
}