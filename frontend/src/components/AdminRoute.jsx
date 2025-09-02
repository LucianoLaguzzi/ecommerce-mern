import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <p>Cargando sesión...</p>; // spinner
  }

  // Si no hay token o no es admin lo mando al inicio
  return token && user?.isAdmin ? children : <Navigate to="/forbidden" />;
  
}
