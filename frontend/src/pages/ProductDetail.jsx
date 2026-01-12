import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useCart from "../context/useCart";
import { formatPrice } from "../utils/formatPrice";
import { API_BASE_URL } from "../config/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localError, setLocalError] = useState(null);
  

  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [zoomActive, setZoomActive] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const mostrarProducto = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(data);
        setError(null); // limpia error por si cargó bien
      } catch (err) {
        if (err.response?.status === 404) {
          setError("El producto no existe o fue eliminado.");
        } else if (err.response?.status === 500) {
          setError("Ocurrió un error en el servidor. Intenta más tarde.");
        } else {
          setError("No se pudo cargar el producto. Intenta nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };
    mostrarProducto();
  }, [id]);

  const handleAdd = () => {
    const error = addToCart(product);
    if (error) {
      setLocalError(error);
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoomActive) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${product.image})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "200%",
      transition: "background-position 0.1s",
    });
  };

  const handleClick = () => {
    setZoomActive(!zoomActive);
    if (!zoomActive) {
      setZoomStyle({
        display: "block",
        backgroundImage: `url(${product.image})`,
        backgroundPosition: `50% 50%`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "200%",
        transition: "background-position 0.1s",
      });
    } else {
      setZoomStyle({ display: "none" });
    }
  };

  if (loading) return <p className="text-center mt-12 text-gray-500">Cargando producto...</p>;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="text-red-600 font-semibold text-xl mb-2">{error}</div>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }
  if (!product) return <p className="text-center mt-12 text-gray-500">No se encontró el producto</p>;

  return (
    <div className="bg-gray-50 min-h-[93vh]">
      {/* Imagen con zoom */}
      <div
        data-test="img-zoom"
        className={`relative w-full h-[400px] md:h-[500px] lg:h-[500px] mx-auto overflow-hidden rounded-b-2xl shadow-lg ${zoomActive ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <img
          data-test="product-image"
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain bg-white shadow-inner rounded-lg transition-transform duration-300"
        />

        {/* Zoom */}
        <div className="absolute inset-0 pointer-events-none" style={{ ...zoomStyle }}></div>

        {/* Nombre sobre la imagen */}
        <div className="absolute inset-0 bg-black/20 flex items-end p-6">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg">
            {product.name}
          </h1>
        </div>
      </div>

      {/* Información */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <p data-test="product-price" className="text-4xl font-bold text-green-600">${formatPrice(product.price)}</p>

        {product.stock <= 0 ? (
          <p className="text-red-600 font-semibold text-lg">¡Producto sin stock!</p>
        ) : product.stock <= 5 ? (
          <p className="text-yellow-500 font-semibold text-lg">¡Quedan pocos en stock!</p>
        ) : null}

        <button
          className={`w-full md:w-1/2 py-3 rounded-lg font-semibold text-white transition
            ${product.stock > 0 ? "bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Agregar al carrito" : "No disponible"}
        </button>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-3">Descripción</h2>
          <p data-test="product-description" className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {localError && <p className="text-red-500 mt-2 font-medium">{localError}</p>}
      </div>
    </div>
  );
}
