import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useCart from "../context/useCart";  // Importa el hook de carrito

export default function ProductDetail() {
  const { id } = useParams(); // saca el id de la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const { addToCart } = useCart();  // Extrae la función para agregar al carrito

  useEffect(() => {
    const mostrarProducto  = async () => {
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

    mostrarProducto ();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No se encontró el producto</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-green-600 mb-4">${product.price}</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => addToCart(product)}  // Agrega el producto al carrito
      >
        Agregar al carrito
      </button>
    </div>
  );
}
