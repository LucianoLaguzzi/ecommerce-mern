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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizo contexto 
      setUser(data);
      // Actualizo localStorage
      localStorage.setItem("auth", JSON.stringify({ user: data, token }));
      
      // actualizar axios defaults (por si cambió algo)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      toast.success("Perfil actualizado");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mi Perfil</h1>

      {!editing ? (
        <div>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Nombre:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            {user.phone && (
              <p>
                <span className="font-semibold">Teléfono:</span> {user.phone}
              </p>
            )}
            {user.address && (
              <p>
                <span className="font-semibold">Dirección:</span> {user.address}
              </p>
            )}
            {user.createdAt && (
              <p>
                <span className="font-semibold">Registrado:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
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
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
