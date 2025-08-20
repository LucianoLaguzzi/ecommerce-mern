// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
