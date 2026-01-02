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

  // No logueado
  if (!token) 
    return <Navigate to="/login" replace />;

   // Logueado pero no admin
  if (!user?.isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  // Admin
  return children;

  
}
