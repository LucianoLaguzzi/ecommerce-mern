import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/auth/forgot-password", {
        email,
        password,
      });

      setSuccess("Contraseña actualizada. Iniciá sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="min-h-[93.9vh] flex items-start justify-center bg-gradient-to-b from-yellow-50 via-orange-100 to-gray-800 px-4 pt-16">
      <div className="bg-gray-800 text-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Recuperar contraseña
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm text-center py-2 px-3 rounded mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-500/20 text-green-400 text-sm text-center py-2 px-3 rounded mb-4">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full bg-gray-700 text-white p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full bg-gray-700 text-white p-3 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="w-full bg-gray-700 text-white p-3 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Cambiar contraseña
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          <Link to="/login" className="text-yellow-400 hover:underline">
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
