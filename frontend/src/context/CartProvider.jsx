import { useState, useEffect } from "react";
import CartContext from "./CartContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito al cambiar de usuario / invitado
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`cartItems_${user._id}`);
      const guest = localStorage.getItem("cartItems_guest");

      let merged = saved ? JSON.parse(saved) : [];

      if (guest) {
        const guestItems = JSON.parse(guest);

        guestItems.forEach(g => {
          const idx = merged.findIndex(i => String(i._id) === String(g._id));
          if (idx !== -1) {
            merged[idx].quantity += g.quantity;
          } else {
            merged.push(g);
          }
        });

        localStorage.removeItem("cartItems_guest"); // limpiar guest
      }

      setCartItems(merged);
    } else {
      const guest = localStorage.getItem("cartItems_guest");
      setCartItems(guest ? JSON.parse(guest) : []);
    }
  }, [user]);

  // Guardar carrito cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("cartItems_guest", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // AHORA acepta cantidad (por defecto 1) y la suma correctamente
  const addToCart = (product, cantidad = 1) => {
    const qty = Math.max(1, Math.floor(Number(cantidad) || 1));

    setCartItems((prev) => {
      const idx = prev.findIndex((i) => String(i._id) === String(product._id));
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...prev[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [...prev, { ...product, quantity: qty }];
    });

    toast.success(`Añadiste ${qty} × ${product.name} al carrito`, {
      duration: 3000,
      style: { marginTop: "50px" }, // respeta tu offset
    });

    return null;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((i) => String(i._id) !== String(productId))
    );
  };

  const clearCart = () => setCartItems([]);

  // En el carrito seguimos respetando tope por stock para +/-
  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (String(i._id) !== String(productId)) return i;
        if (i.quantity >= i.stock) return i;
        return { ...i, quantity: i.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((i) =>
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
