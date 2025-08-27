// LogoutModal.jsx
export default function LogoutModal({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-lg">
        <div className="w-12 h-12 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold">Cerrando sesión...</p>
      </div>
    </div>
  );
}
