import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useCart from "../context/useCart";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(false);
  }, [user]);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-yellow-400 hover:text-yellow-500 transition">
          Mi Tienda
        </Link>

        {/* Links y usuario */}
        <div className="flex items-center gap-6">

          {!user && (
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition"
              >
                Registro
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-4">

              {/* Carrito */}
              <Link to="/cart" className="relative group">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-6 h-6 text-gray-200 group-hover:text-yellow-400 transition"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25h1.5l2.25 12.75h12.75l2.25-9H6.75M6 21a.75.75 0 110-1.5.75.75 0 010 1.5zm12 0a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Separador para no superponer */}
              <div className="ml-4 relative" ref={dropdownRef}>

                {/* Avatar */}
                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  title={user.name}
                  className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold cursor-pointer hover:bg-yellow-500 transition"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown */}
                {openDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-200 hover:bg-gray-700 transition"
                    onClick={() => setOpenDropdown(false)}
                  >
                    Mi Perfil
                  </Link>

                  <Link
                    to="/myorders"
                    className="block px-4 py-3 text-gray-200 hover:bg-gray-700 transition"
                    onClick={() => setOpenDropdown(false)}
                  >
                    Mis Compras
                  </Link>
 
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}

              </div>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
