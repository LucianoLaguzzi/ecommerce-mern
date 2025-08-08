import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const cargarProductos  = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    cargarProductos ();

    
  }, []);



  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <Link
                to={`/product/${product._id}`}
                className="text-blue-500 hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
