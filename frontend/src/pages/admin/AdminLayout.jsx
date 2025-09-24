import { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

export default function AdminLayout() {
  const tabs = [
    { id: "users", label: "Usuarios", component: <AdminUsers /> },
    { id: "products", label: "Productos", component: <AdminProducts /> },
    { id: "orders", label: "Órdenes", component: <AdminOrders /> },
  ];

  const [activeTab, setActiveTab] = useState("users");
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-100">   {/* fondo de las tablas */}
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col">
        <h2 className="text-xl font-bold text-center py-6 border-b border-gray-700">
          Panel Admin
        </h2>
        <nav className="flex flex-col mt-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-left px-6 py-3 font-medium transition-colors ${
                t.id === activeTab
                  ? "bg-gray-700 text-indigo-400 border-l-4 border-indigo-500"
                  : "hover:bg-gray-700 hover:text-indigo-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {currentTab.label}
        </h1>

        <div className="bg-white shadow-md rounded-xl p-6">
          {currentTab.component}
        </div>
      </main>
    </div>
  );
}
