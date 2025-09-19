import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-start  min-h-[93.9vh] bg-gradient-to-b from-red-600 to-red-900 text-white text-center px-4 pt-40">
      <h1 className="text-7xl font-extrabold mb-4">403</h1>
      <h2 className="text-3xl font-bold mb-2">Acceso Denegado</h2>
      <p className="text-lg mb-8 max-w-xl">
        No tenés permisos para ingresar a esta página.  
        Si creés que esto es un error, contactá al administrador.
      </p>
      <Link
        to="/"
        className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-red-100 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
