import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password, phone, address
      });
      login({
        token: data.token,
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        createdAt: data.createdAt,
        isAdmin: data.isAdmin,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-[93.9vh] flex items-start justify-center bg-gradient-to-b from-yellow-50 via-orange-100 to-gray-800 px-4 pt-16">
      <div className="bg-gray-800 text-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Registro
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm text-center py-2 px-3 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dirección"
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
