import useCart from "../context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";
import { API_BASE_URL } from "../config/api";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    setQuantity,
  } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
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

    const sinStock = cartItems.filter((i) => i.stock <= 0);
    const cantidadExcedida = cartItems.filter((i) => i.quantity > i.stock);

    if (sinStock.length > 0 || cantidadExcedida.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Stock insuficiente",
        html: `
          ${
            sinStock.length > 0
              ? `<p>Los siguientes productos no tienen stock: <b>${sinStock
                  .map((p) => p.name)
                  .join(", ")}</b></p>`
              : ""
          }
          ${
            cantidadExcedida.length > 0
              ? `<p>Algunos productos superan el stock disponible: <b>${cantidadExcedida
                  .map((p) => p.name)
                  .join(", ")}</b></p>`
              : ""
          }
        `,
      });
      return;
    }

    if (!user || !token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión para comprar",
        text: "Necesitas una cuenta para finalizar la compra.",
        confirmButtonText: "Ir a login",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/login?redirect=/cart");
        }
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/orders`,
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

  const CartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6 inline-block mr-2 text-gray-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 2.25h1.5l2.25 12.75h12.75l2.25-9H6.75M6 21a.75.75 0 110-1.5.75.75 0 010 1.5zm12 0a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  );

  return (
  <div className="max-w-5xl mx-auto p-6">
    {cartItems.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[60vh] -mt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center text-gray-800">
          {CartIcon} Mis productos
        </h2>
        <div className="bg-gray-100 border border-gray-300 px-8 py-10 rounded-xl shadow-lg text-center max-w-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
            {CartIcon} Carrito vacío
          </h3>
          <p className="text-gray-600 mb-6">
            No has agregado productos todavía. ¡Explora nuestra tienda!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 flex items-center">{CartIcon} Mis productos</h2>
          <div className="space-y-4">
            {cartItems.map((item) => {
              const stockNum = Number(item.stock) || 0;
              const maxPermitido = stockNum > 0 ? stockNum : 1;
              const subtotal = item.price * item.quantity;
              return (
                <div
                  data-test="cart-item"
                  key={item._id}
                  className="bg-white border rounded-xl shadow-md p-5 grid grid-cols-1 sm:grid-cols-5 items-center gap-5 hover:shadow-lg transition-shadow"
                >
                  {/* FOTO */}
                  <div>
                    {item.image ? (
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded hover:scale-105 transition"
                        />
                      </Link>
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* NOMBRE + STOCK */}
                  <div className="col-span-2 mt-2 sm:mt-0">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold truncate text-lg text-gray-800 hover:text-blue-600 hover:scale-105 transition-all"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                    <p className="text-gray-600 text-sm" data-test="cart-price">Precio: ${formatPrice(item.price)}</p>
                    {stockNum <= 0 ? (
                      <p className="text-red-500 text-sm">¡Sin stock!</p>
                    ) : item.quantity >= stockNum ? (
                      <p className="text-red-500 text-sm">¡Máximo disponible!</p>
                    ) : stockNum - item.quantity <= 5 ? (
                      <p className="text-yellow-500 text-sm">
                        {stockNum - item.quantity === 1
                          ? "¡Última unidad!"
                          : `¡Quedan ${stockNum - item.quantity} unidades!`}
                      </p>
                    ) : null}
                  </div>

                  {/* CANTIDAD */}
                  
                  {/* CANTIDAD */}
                  <div className="flex flex-col items-start sm:items-center">
                    <p className="text-gray-600 text-sm">
                      {item.quantity} × ${formatPrice(item.price)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                    
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id)}
                        disabled={item.quantity === 1}
                        className={`px-3 py-1 border border-gray-300 text-gray-700 font-semibold transition-colors active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          item.quantity === 1
                            ? "bg-gray-100 cursor-not-allowed opacity-50"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={item.stock || 1}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item._id, e.target.value)}
                        onBlur={(e) => setQuantity(item._id, e.target.value)}
                        className="w-16 text-center border border-gray-300 rounded px-1 py-1 focus:ring-1 focus:ring-blue-300"
                      />

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item._id)}
                        disabled={item.quantity >= maxPermitido || stockNum <= 0}
                        className={`px-3 py-1 border border-gray-300 text-gray-700 font-semibold transition-colors active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          item.quantity >= maxPermitido || stockNum <= 0
                            ? "bg-gray-100 cursor-not-allowed opacity-50"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        +
                      </button>
                    
                    </div>
                  </div>

                  {/* SUBTOTAL + ELIMINAR */}
                  <div className="text-right flex flex-col items-end mt-2 sm:mt-0">
                    
                    <p className="font-bold text-lg" data-test="cart-line-total">${formatPrice(subtotal)}</p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="flex items-center text-red-500 text-sm hover:text-red-700 mt-2 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESUMEN DEL TOTAL */}
          <div className="bg-gray-50 border-t border-gray-200 rounded-xl p-6 mt-6 shadow-md">
            <h3 className="text-xl font-bold mb-3">Resumen</h3>
            <p className="text-lg mb-4" data-test="cart-total">
              Total: <span className="font-extrabold text-gray-800">${formatPrice(total)}</span>
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className={`w-full py-3 rounded-lg text-white font-bold ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition"
              }`}
            >
              {loading ? "Procesando..." : "Finalizar Compra"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
