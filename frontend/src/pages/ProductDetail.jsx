import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useCart from "../context/useCart";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localError, setLocalError] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const mostrarProducto = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError("No se pudo cargar el producto" + err);
        setLoading(false);
      }
    };
    mostrarProducto();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No se encontró el producto</p>;

  const handleAdd = () => {
    const error = addToCart(product);
    if (error) {
      setLocalError(error);
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-green-600 mb-4">${product.price}</p>

      <div className="mt-2">
        {product.stock <= 0 ? (
          <p className="text-red-500 font-semibold">¡Producto sin stock!</p>
        ) : product.stock <= 5 ? (
          <p className="text-yellow-500 font-semibold">¡Quedan pocos en stock!</p>
        ) : null}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
        onClick={handleAdd}
      >
        Agregar al carrito
      </button>
      {localError && <p className="text-red-500 mt-1">{localError}</p>}
    </div>
  );
}
