import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[93.9vh] bg-gradient-to-b from-orange-500 to-yellow-400 text-center px-4 pt-40">
      <h1 className="text-7xl font-extrabold text-gray-900 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Página no encontrada</h2>
      <p className="text-gray-100 text-lg mb-8 max-w-lg">
        La página que estás buscando no existe o fue eliminada.
      </p>
      <Link
        to="/"
        className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-100 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
