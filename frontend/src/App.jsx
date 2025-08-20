import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />

           {/* RUTA PROTEGIDA */}
          <Route path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            }
          />

          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </div>
      
       <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
