import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Comprobamos si hay un rastro de sesión (nombre o token)
  const isAuthenticated = document.cookie.includes('tokencito');

  if (!isAuthenticated) {
    // Si no está autenticado, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza los hijos (el Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;