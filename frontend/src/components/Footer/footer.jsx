export default function Footer() {
    return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-white/30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">© {new Date().getFullYear()} Juguetería — Todos los derechos reservados</div>
        <div className="flex items-center gap-4">
            <a href="https://www.instagram.com" className="text-gray-700 hover:text-purple-600">Instagram</a>
            <a href="https://www.facebook.com" className="text-gray-700 hover:text-purple-600">Facebook</a>
            <a href="https://www.twitter.com" className="text-gray-700 hover:text-purple-600">Twitter</a>
        </div>
        </div>
    </footer>
    );
}