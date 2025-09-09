import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [token]); // depende solo del token




  const handleDelete = async (id) => {
    if (id === user._id) {
      await Swal.fire({
        title: "Acción no permitida",
        text: "No podés eliminarte a vos mismo",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Seguro que querés eliminar este usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar usuario");
        toast.success("Usuario eliminado");
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        console.error(err);
        toast.error("No se pudo eliminar el usuario");
      }
    }
  };

  const handleToggleAdmin = async (id, isAdmin) => {
    if (id === user._id) return;

    const result = await Swal.fire({
      title: `¿Deseás ${isAdmin ? "quitar" : "dar"} permisos de admin a este usuario?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });
      if (!res.ok) throw new Error("Error al actualizar usuario");
      const updated = await res.json();
      setUsers(users.map((u) => (u._id === id ? updated : u)));
      toast.success("Usuario actualizado");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar el usuario");
    }
  };

  if (loading) return <p className="text-gray-600">Cargando usuarios...</p>;

  if (users.length === 0)
    return <p className="text-gray-500 text-center">No hay usuarios registrados.</p>;

  return (
  <div>
    {/* Subtítulo centrado sobre la tabla */}
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
      Gestión de Usuarios
    </h2>

    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase text-sm tracking-wider">Nombre</th>
          <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase text-sm tracking-wider">Email</th>
          <th className="px-6 py-3 text-center text-gray-700 font-bold uppercase text-sm tracking-wider">Rol</th>
          <th className="px-6 py-3 text-center text-gray-700 font-bold uppercase text-sm tracking-wider">Acciones</th>
        </tr>
      </thead>
      
      <tbody>
        {users.map((u, i) => (
          <tr key={u._id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
            <td className="px-6 py-4 text-gray-800">{u.name}</td>
            <td className="px-6 py-4 text-gray-600">{u.email}</td>
            
           <td className="px-6 py-4 text-center">
              {u.isAdmin ? (
                <span className="inline-block px-4 py-1 text-xs font-semibold text-indigo-700 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full shadow-sm border border-indigo-200 transition-all hover:scale-105">
                  Admin
                </span>
              ) : (
                <span className="inline-block px-4 py-1 text-xs font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-sm border border-gray-300 transition-all hover:scale-105">
                  Usuario
                </span>
              )}
            </td>

            <td className="px-6 py-4 text-center space-x-2">
              <button
                onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                className={`px-2 py-1 text-xs rounded border transition ${
                  u._id === user._id
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                }`}
                disabled={u._id === user._id}
              >
                Cambiar Rol
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className={`px-2 py-1 text-xs rounded border transition ${
                  u._id === user._id
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                }`}
                disabled={u._id === user._id}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="4" className="px-6 py-3 text-right text-sm text-gray-600 bg-gray-50">
              Total de usuarios: {users.length}
            </td>
          </tr>
        </tfoot>
      
    </table>
  </div>
);
}
