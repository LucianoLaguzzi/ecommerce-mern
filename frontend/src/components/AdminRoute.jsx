import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, user, loadingAuth } = useAuth();

  if (loadingAuth) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
    </div>
  );
}

  // Si no hay token o no es admin lo mando al inicio
  return token && user?.isAdmin ? children : <Navigate to="/forbidden" />;
  
}
