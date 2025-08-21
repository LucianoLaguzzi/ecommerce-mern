import useCart from "../context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 saber si está logueado
  const token = localStorage.getItem("auth") 
    ? JSON.parse(localStorage.getItem("auth")).token 
    : null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "Agrega productos antes de finalizar la compra.",
      });
      return;
    }

    //Validar stock antes de enviar al backend
    const sinStock = cartItems.filter(i => i.stock <= 0);
    const cantidadExcedida = cartItems.filter(i => i.quantity > i.stock);

    if (sinStock.length > 0 || cantidadExcedida.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Stock insuficiente",
        html: `
          ${sinStock.length > 0 ? `<p>Los siguientes productos no tienen stock: <b>${sinStock.map(p => p.name).join(", ")}</b></p>` : ""}
          ${cantidadExcedida.length > 0 ? `<p>Algunos productos superan el stock disponible: <b>${cantidadExcedida.map(p => p.name).join(", ")}</b></p>` : ""}
        `,
      });
      return;
    }

    // Si NO hay usuario, obligar a loguearse
    if (!user || !token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión para comprar",
        text: "Necesitas una cuenta para finalizar la compra.",
        confirmButtonText: "Ir a login",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/login?redirect=/cart"); // redirige al login
        }
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        { items: cartItems, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();

      Swal.fire({
        icon: "success",
        title: "¡Compra realizada con éxito!",
        text: "Tu pedido está en proceso 🚀",
        showConfirmButton: false,
        timer: 2500,
      });

      setTimeout(() => navigate("/"), 2500);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Error al realizar la compra",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p className="mb-2">El carrito está vacío.</p>
          <Link to="/" className="text-blue-500 underline">Ver productos</Link>
        </div>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id} className="flex items-center justify-between border-b py-4 min-h-[84px]">
                <div className="flex items-center space-x-4 min-w-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-gray-600">${item.price} x {item.quantity}</p>

                    {item.stock <= 0 ? (
                      <p className="text-red-500 text-sm">¡Sin stock!</p>
                    ) : item.quantity >= item.stock ? (
                      <p className="text-red-500 text-sm">¡Sin stock!</p>
                    ) : (item.stock - item.quantity) <= 5 ? (
                      <p className="text-yellow-500 text-sm">
                        {item.stock - item.quantity === 1
                          ? "¡Última unidad disponible!"
                          : `¡Quedan ${item.stock - item.quantity} unidades!`}
                      </p>
                    ) : null}
                    
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item._id)}
                      disabled={item.quantity === 1}
                      className={`px-3 py-1 rounded ${
                        item.quantity === 1 ? "bg-gray-300 text-gray-700 cursor-not-allowed" :
                        "bg-gray-700 text-white hover:bg-gray-800"
                      }`}
                    >
                      -
                    </button>

                    <span className="px-3">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item._id)}
                      disabled={item.quantity >= (Number(item.stock) || 0) || item.stock <= 0}
                      className={`px-3 py-1 rounded ${
                        item.quantity >= (Number(item.stock) || 0) || item.stock <= 0
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed opacity-70"
                          : "bg-gray-700 text-white hover:bg-gray-800"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-6">Total: ${total.toFixed(2)}</h3>

          <button
            type="button"
            onClick={handleCheckout}
            className={`mt-4 w-full py-2 rounded text-white font-bold ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Procesando..." : "Finalizar Compra"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
