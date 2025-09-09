import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = JSON.parse(localStorage.getItem("auth"))?.token;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las órdenes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Estado actualizado");
      fetchOrders(); // refrescar tabla
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar estado");
    }
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 border-b">#Orden</th>
            <th className="px-4 py-2 border-b">Usuario</th>
            <th className="px-4 py-2 border-b">Total</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Fecha</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center border-b">
              <td className="px-4 py-2">{order._id.slice(-6).toUpperCase()}</td>
              <td className="px-4 py-2">{order.user?.name || order.user?.email}</td>
              <td className="px-4 py-2">${formatPrice(order.total)}</td>
              <td className="px-4 py-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">
                <a
                  href={`/orders/${order._id}`}
                  className="text-yellow-400 hover:underline"
                >
                  Ver
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
