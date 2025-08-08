import { Link } from "react-router-dom";
import useCart from "../context/useCart";

export default function Navbar() {

  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold">Mi Tienda</Link>
        <div className="space-x-4">
          <Link to="/cart" className="relative inline-block" title="Carrito">
            <span className="text-2xl">🛒</span>
            {totalQuantity > 0 && (
              <span
                className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                aria-label={`${totalQuantity} items en carrito`}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </div>
      </div>
    </nav>
  );
}
