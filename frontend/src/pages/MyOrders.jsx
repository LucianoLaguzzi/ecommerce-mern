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

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (orders.length === 0) return <p>No tenés órdenes todavía.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Compras</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="border-b py-4">
            <Link
              to={`/orders/${order._id}`}
              className="font-semibold text-yellow-400 hover:underline"
            >
              Orden #{order._id.slice(-6).toUpperCase()}
            </Link>
            <p>Total: ${formatPrice(order.total)}</p>
            <p>Estado:  <span 
                          className={`px-2 py-1 rounded-full text-sm font-medium border
                              ${order.status.toLowerCase() === "pendiente" ? "text-yellow-600 border-yellow-600" : ""}
                              ${order.status.toLowerCase() === "completada" ? "text-green-600 border-green-600" : ""}
                              ${order.status.toLowerCase() === "cancelada" ? "text-red-600 border-red-600" : ""}
                          `}
                        >
                          {order.status}
                      </span>
            </p>
            <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

    </div>
  );
}
