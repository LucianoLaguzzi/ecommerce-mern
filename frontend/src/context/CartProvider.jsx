import { useState, useEffect } from "react";
import CartContext from "./CartContext";
import { useAuth } from "./AuthContext";
import toast from 'react-hot-toast';

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito al cambiar de usuario
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`cartItems_${user._id}`);
      setCartItems(saved ? JSON.parse(saved) : []);
    } else {
      const guest = localStorage.getItem("cartItems_guest");
      setCartItems(guest ? JSON.parse(guest) : []);
    }
  }, [user]);

  // Guardar carrito en localStorage siempre que cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("cartItems_guest", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product) => {
    const existing = cartItems.find((i) => String(i._id) === String(product._id));

    if (existing) {
      setCartItems(prev =>
        prev.map(i =>
          String(i._id) === String(product._id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }

    toast.success(`${product.name} agregado al carrito!`, {
      duration: 3000, // 3 segundos
        style: {
          marginTop: "50px", // lo desplazo mas abajo desde el top right(app.jsx)
        },
    });

    return null; // no bloquea el agregado
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter((i) => String(i._id) !== String(productId)));
  };

  const clearCart = () => setCartItems([]);

  const increaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(i => {
        if (String(i._id) !== String(productId)) return i;
        if (i.quantity >= i.stock) return i;
        return { ...i, quantity: i.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(i =>
        String(i._id) === String(productId)
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
