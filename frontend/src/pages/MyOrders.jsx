import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice"

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const listOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar tus órdenes");
      }
      setLoading(false);
    };

    listOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 px-4 pt-16">
      {/* Contenedor principal “flotante” */}
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.25)" }}>
          Mis Compras
        </h2>

        {loading && <p className="text-center text-gray-600">Cargando órdenes...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-500 text-center">No tenés órdenes todavía.</p>
        )}

        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="relative bg-white/90 rounded-xl p-4 border-l-4 border-yellow-300
                        shadow-[0_-2px_4px_rgba(0,0,0,0.05),0_2px_2px_rgba(0,0,0,0.05)]
                        hover:shadow-[0_-2px_4px_rgba(0,0,0,0.05),0_6px_12px_rgba(0,0,0,0.15)]
                        transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <Link
                  to={`/orders/${order._id}`}
                  className="font-semibold text-yellow-500 hover:text-yellow-600 hover:underline"
                >
                  Orden #{order._id.slice(-6).toUpperCase()}
                </Link>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium border
                    ${order.status.toLowerCase() === "pendiente" ? "text-yellow-600 border-yellow-500" : ""}
                    ${order.status.toLowerCase() === "completada" ? "text-green-600 border-green-400" : ""}
                    ${order.status.toLowerCase() === "cancelada" ? "text-red-600 border-red-400" : ""}
                  `}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 uppercase tracking-wide text-xs">
                  Total <span className="normal-case font-semibold text-gray-700 text-sm ml-1">${formatPrice(order.total)}</span>
                </span>
                <span className="text-gray-500 uppercase tracking-wide text-xs">
                  Fecha <span className="normal-case font-semibold text-gray-700 text-sm ml-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

            </li>

          ))}
        </ul>

      </div>
    </div>
  );
}


