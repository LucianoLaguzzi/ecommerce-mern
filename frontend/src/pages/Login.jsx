// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

//user de prueba: prueba@gmail.com

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]   = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Si viene ?redirect=/algo en la URL, lo guardamos
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email, password
      });
      // data = { _id, name, email, isAdmin, token }
      login({
        token: data.token,
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });

      // En lugar de siempre ir al home, usamos el redirect
      navigate(redirect);

    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Ingresar
        </button>
      </form>
    </div>
  );
}
