// src/pages/admin/AdminOrders.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { API_BASE_URL } from "../../config/api";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtro y control del input en header (igual a AdminProducts)
  const [filter, setFilter] = useState("");
  const [orderFilterActive, setOrderFilterActive] = useState(false);
  const orderFilterInputRef = useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [token]);

  // focus cuando se activa el input de filtro
  useEffect(() => {
    if (orderFilterActive && orderFilterInputRef.current) {
      orderFilterInputRef.current.focus();
    }
  }, [orderFilterActive]);

  // aplicar filtro por los últimos 6 caracteres del _id (shortId)
  const filteredOrders = orders.filter((o) => {
    const shortId = o._id.slice(-6);
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    const sid = shortId.toLowerCase();
    return sid.startsWith(q) || sid.includes(q);
  });

  if (loading) return <p className="text-gray-600">Cargando órdenes...</p>;

  return (
    <div>
      {/* Subtítulo centrado sobre la tabla */}
      <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-700">
        Gestión de Órdenes
      </h2>
      
      <div className="max-h-[60vh] overflow-y-auto border rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 sticky top-0 z-20">
              <th className="px-6 py-3 text-left text-gray-700 font-bold">
                {!orderFilterActive ? (
                  <div className="flex items-center gap-2">
                    <span>#Orden</span>
                    <button
                      data-test = "cy-filtrar"
                      type="button"
                      onClick={() => setOrderFilterActive(true)}
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Filtrar por orden"
                      title="Filtrar por orden"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <input
                    data-test="input-filtro"
                    ref={orderFilterInputRef}
                    type="text"
                    placeholder="Filtrar orden..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setOrderFilterActive(false);
                    }}
                    onBlur={() => setOrderFilterActive(false)}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm max-w-[200px]"
                  />
                )}
              </th>

              <th className="px-6 py-3 text-left text-gray-700 font-bold">Usuario</th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold">Total</th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold">Estado</th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold">Fecha</th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody data-test="tabla-orders">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td data-test="cy-order-n" className="px-6 py-3">
                  {order._id.slice(-6).toUpperCase()}
                </td>
                <td data-test="cy-order-name" className="px-6 py-3">{order.user?.name || order.user?.email}</td>
                <td data-test="cy-order-total" className="px-6 py-3">${formatPrice(order.total)}</td>
                <td data-test="cy-order-status" className="px-6 py-3 capitalize">
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await axios.patch(
                          `${API_BASE_URL}/api/orders/${order._id}`,
                          { status: newStatus },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );

                        setOrders((prev) =>
                          prev.map((o) =>
                            o._id === order._id ? { ...o, status: newStatus } : o
                          )
                        );
                      } catch (err) {
                        console.error("Error al actualizar estado:", err);
                        alert("No se pudo actualizar el estado");
                      }
                    }}
                    className={`border rounded px-3 py-1 text-sm font-medium capitalize
                      ${
                        order.status.toLowerCase() === "pendiente"
                          ? "text-yellow-800 bg-yellow-50 border-yellow-300"
                          : order.status.toLowerCase() === "completada"
                          ? "text-green-800 bg-green-50 border-green-300"
                          : order.status.toLowerCase() === "cancelada"
                          ? "text-red-800 bg-red-50 border-red-300"
                          : "text-gray-800 bg-white border-gray-300"
                      }
                    `}
                  >
                    <option value="Pendiente" className="text-gray-700 bg-white">Pendiente</option>
                    <option value="Completada" className="text-gray-700 bg-white">Completada</option>
                    <option value="Cancelada" className="text-gray-700 bg-white">Cancelada</option>
                  </select>
                </td>

                <td data-test="cy-order-date" className="px-6 py-3">
                  {new Date(order.createdAt).toLocaleString("es-AR")}
                </td>
                <td className="px-6 py-3">
                  <Link data-test="cy-order-goto" to={`/orders/${order._id}`} className="text-yellow-500 hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
