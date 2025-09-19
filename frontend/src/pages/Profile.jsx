// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, token, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data);
      localStorage.setItem("auth", JSON.stringify({ user: data, token }));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      toast.success("Perfil actualizado");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar");
    }
  };

  return (
    <div className="min-h-[93vh] flex items-start justify-center bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 px-4 pt-16">
      <div className="bg-white text-gray-800 w-full max-w-lg p-8 rounded-2xl shadow-lg border border-gray-200">
        
        {/* Avatar + Nombre */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-3xl font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {!editing ? (
          <>
            {/* Datos en grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Teléfono */}
              {user.phone && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.316 1.07l-2.21 1.772a11.042 11.042 0 005.516 5.516l1.772-2.21a1 1 0 011.07-.316l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                </div>
              )}

              {/* Dirección */}
              {user.address && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z
                            M12 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-semibold">{user.address}</p>
                  </div>
                </div>
              )}

              {/* Fecha registro */}
              {user.createdAt && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 sm:col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-7 4h4m-9 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Registrado</p>
                    <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Editar Perfil
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {["name", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 capitalize mb-1">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            ))}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                  });
                  setEditing(false);
                }}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
