import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/products?page=${page}&limit=6`
      );
      setProducts(data.products);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Bienvenido a Mi Tienda</h1>
        <p className="text-lg md:text-xl">Descubre nuestros productos destacados</p>
      </div>

      <div className="container mx-auto p-6 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Catálogo</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">No hay productos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white border rounded-xl p-5 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center text-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-green-600 font-bold mb-2">${formatPrice(product.price)}</p>
                <span className="text-blue-500 hover:underline font-medium">Ver detalles</span>
              </Link>
            ))}
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-center mt-8 gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-2 font-semibold text-gray-700">{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Mi Ecommerce - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
