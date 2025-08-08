// src/context/CartProvider.jsx
//En el main.jsx se agrega <CartProvider> toda la app puede usar el carrito, porque está "envuelta" por el proveedor del contexto
//Aca se implementa la logica del carrito

import { useState, useEffect } from "react";
import CartContext from "./CartContext";


const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

    //Agregar al carro
    const addToCart = (product) => {
      setCartItems((prevItems) => {
        const existingProduct = prevItems.find(item => item._id === product._id);

        if (existingProduct) {
          if (existingProduct.quantity >= product.stock) {
            alert("No hay más stock disponible de este producto.");
            return prevItems;
          }

          return prevItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? item.quantity < item.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item // no cambia si ya está al máximo
          : item
        
      )
    );
    
  };
  

    const decreaseQuantity = (productId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
      );
    };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
