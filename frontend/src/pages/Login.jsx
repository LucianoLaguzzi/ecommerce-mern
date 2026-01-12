// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login({
        token: data.token,
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        phone: data.phone,
        address: data.address,
        createdAt: data.createdAt,
      });

      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
   <div className="min-h-[93.9vh] flex items-start justify-center bg-gradient-to-b from-yellow-50 via-orange-100 to-gray-800 px-4 pt-16">
      <div className="bg-gray-800 text-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm text-center py-2 px-3 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
            <input
              data-cy="password"
              type="password"
              placeholder="********"
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </p>

        <p className="text-sm text-center text-gray-400 mt-3">
          ¿Olvidaste tu contraseña?{" "}
          <Link
            to="/forgot-password"
            className="text-yellow-400 hover:underline font-medium"
          >
            Recuperarla
          </Link>
        </p>
        
      </div>
    </div>
  );
}
