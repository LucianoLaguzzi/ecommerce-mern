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

        guestItems.forEach((g) => {
          const idx = merged.findIndex((i) => String(i._id) === String(g._id));
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

  // Agregar al carrito (suma cantidad)
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

    toast.success(`Añadiste ${product.name} × ${qty} al carrito`, {
      duration: 3000,
      style: { marginTop: "50px" },
    });

    return null;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((i) => String(i._id) !== String(productId))
    );
  };

  const clearCart = () => setCartItems([]);

  // + / - con tope por stock (figurativo)
  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (String(i._id) !== String(productId)) return i;
        if (i.quantity >= (Number(i.stock) || 0)) return i;
        if ((Number(i.stock) || 0) <= 0) return i;
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

  // 🔹 NUEVO: setear cantidad exacta (desde input)
  const setQuantity = (productId, cantidad) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (String(i._id) !== String(productId)) return i;

        const stock = Number(i.stock) || 0;
        let n = Math.floor(Number(cantidad));

        // Si no es número válido, forzamos a 1 para no romper totales
        if (!Number.isFinite(n)) n = 1;

        // mínimo 1
        n = Math.max(1, n);

        // si hay stock (>0), tope = stock; si no hay stock, queda 1
        if (stock > 0) {
          n = Math.min(n, stock);
        } else {
          n = 1;
        }

        return { ...i, quantity: n };
      })
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
        setQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
