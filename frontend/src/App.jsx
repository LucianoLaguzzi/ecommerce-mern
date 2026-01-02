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
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";


import { Toaster } from "react-hot-toast";


function App() {
  return (
    <Router>
      <Navbar />
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

          {/* Panel de control admin */}
          <Route 
            path="/admin/*"       //wildcard para sub-rutas internas
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            } 
          />

          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="/forbidden" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />


        </Routes>

      
       <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
