import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";
import { API_BASE_URL } from "../config/api";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar la orden");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id, token]);

  if (loading) return <p className="text-center text-gray-600">Cargando orden...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!order) return <p className="text-center text-gray-500">Orden no encontrada.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 px-4 pt-16">
      {/* Contenedor principal */}
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6">
        <h2
          className="text-3xl font-bold mb-6 text-yellow-400 text-center"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.25)" }}
        >
          Detalle de Orden
        </h2>

        {/* Info principal */}
        <div
          className="bg-white/90 rounded-xl p-4 border-l-4 border-yellow-300
                    shadow-[0_-2px_4px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.05)]
                    mb-6"
        >
          <p className="text-gray-500 uppercase tracking-wide text-xs">
            Orden
            <span className="normal-case font-semibold text-gray-700 text-sm ml-1">
              #{order._id.slice(-6).toUpperCase()}
            </span>
          </p>
          <p className="text-gray-500 uppercase tracking-wide text-xs">
            Total
            <span className="normal-case font-semibold text-gray-700 text-sm ml-1">
              ${formatPrice(order.total)}
            </span>
          </p>
          <p className="text-gray-500 uppercase tracking-wide text-xs">
            Fecha
            <span className="normal-case font-semibold text-gray-700 text-sm ml-1">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-gray-500 uppercase tracking-wide text-xs">
            Estado
            <span
              className={`normal-case font-semibold text-sm ml-1
                ${order.status.toLowerCase() === "pendiente" ? "text-yellow-600" : ""}
                ${order.status.toLowerCase() === "completada" ? "text-green-600" : ""}
                ${order.status.toLowerCase() === "cancelada" ? "text-red-600" : ""}
              `}
            >
              {order.status}
            </span>
          </p>
        </div>


        {/* Dirección de envío */}
        {order.address && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Dirección de Envío</p>
            <p className="font-semibold text-gray-700">{order.address}</p>
          </div>
        )}

        {/* Items de la orden */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Productos</h3>
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100 " 
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                     ${formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-700">
                  ${formatPrice(item.quantity * item.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <Link
            to="/myorders"
            className="text-yellow-500 hover:text-yellow-600 font-medium underline"
          >
            ← Volver a mis compras
          </Link>
        </div>
      </div>
    </div>
  );
}
