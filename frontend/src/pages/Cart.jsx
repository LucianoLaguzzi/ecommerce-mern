// src/pages/Cart.jsx
import useCart from "../context/useCart";

function Cart() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

 return (
  <div className="max-w-xl mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4">Carrito</h2>
    {cartItems.length === 0 ? (
      <p className="text-gray-500">El carrito está vacío.</p>
    ) : (
      <ul>
        {cartItems.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">${item.price} x {item.quantity}</p>
            </div>
            <div className="flex items-center space-x-2">
             <button
                onClick={() => decreaseQuantity(item._id)}
                disabled={item.quantity === 1}
                className={`mx-2 px-2 py-1 rounded ${
                  item.quantity === 1
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded'
                }`}
              >
                -
              </button>
              <button
                onClick={() => increaseQuantity(item._id)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
                aria-label={`Aumentar cantidad de ${item.name}`}
              >
                +
              </button>

              
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                aria-label={`Eliminar ${item.name} del carrito`}
              >
                Eliminar
              </button>


            {item.quantity >= item.stock && (
              <p className="text-sm text-red-500 mt-1">
                Stock máximo alcanzado
              </p>
            )}


            </div>
          </li>
        ))}
      </ul>
    )}
    <h3 className="text-xl font-semibold mt-4">
      Total: ${total.toFixed(2)}
    </h3>
  </div>
);
}

export default Cart;
