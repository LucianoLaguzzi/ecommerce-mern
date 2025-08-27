import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!token) { //no hago nada hasta que el token este listo
      return;
    }

    const MostrarOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar la orden");
      }
      setLoading(false);
    };
    MostrarOrder();
  }, [id, token]);

  if (loading) 
    return <p>Cargando orden...</p>;

  if (error) 
    return <p className="text-red-500">{error}</p>;
  
  if (!order) 
    return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Orden #{order._id.slice(-6).toUpperCase()}</h2>
      <p>Estado: <span className="capitalize">{order.status}</span></p>
      <p>Total: ${order.total.toFixed(2)}</p>
      <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>

      <h3 className="text-xl mt-4 font-semibold">Productos:</h3>
      <ul className="ml-4">
        {order.items.map((item) => (
          <li key={item.productId} className="py-1">
           {item.name} x {item.quantity} (${item.price.toFixed(2)} c/u) = ${(item.price * item.quantity).toFixed(2)}

          </li>
        ))}
      </ul>

      <Link to="/myorders" className="mt-4 inline-block text-yellow-400 hover:underline">
        ← Volver a Mis Compras
      </Link>
    </div>
  );
}
