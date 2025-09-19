import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/formatPrice";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtro
  const [filter, setFilter] = useState("");
  const [nameFilterActive, setNameFilterActive] = useState(false);
  const nameFilterInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", stock: "", image: null, preview: null,
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/products?page=${page}&limit=6`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data.products);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    if (nameFilterActive && nameFilterInputRef.current) nameFilterInputRef.current.focus();
  }, [nameFilterActive]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (newProduct.preview) URL.revokeObjectURL(newProduct.preview);
      const file = files[0];
      setNewProduct({ ...newProduct, image: file || null, preview: file ? URL.createObjectURL(file) : null });
    } else setNewProduct({ ...newProduct, [name]: value });
  };

  const resetForm = () => {
    if (newProduct.preview) URL.revokeObjectURL(newProduct.preview);
    setNewProduct({ name: "", description: "", price: "", stock: "", image: null, preview: null });
    setEditingProduct(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (!res.ok) throw new Error(editingProduct ? "Error al actualizar" : "Error al crear producto");
      const data = await res.json();

      if (editingProduct) {
        setProducts(products.map((p) => (p._id === data._id ? data : p)));
        toast.success("Producto actualizado");
      } else {
        setProducts([data, ...products]);
        toast.success("Producto creado");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(editingProduct ? "No se pudo actualizar el producto" : "No se pudo crear el producto");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, description: product.description, price: product.price, stock: product.stock, image: null, preview: product.image || null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({ title: "¿Eliminar producto?", text: "No podrás revertir esto", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar" });
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Error al eliminar");
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Producto eliminado");
      } catch (err) { console.error(err); toast.error("No se pudo eliminar el producto"); }
    }
  };

  if (loading) return <p className="text-gray-600">Cargando productos...</p>;

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Gestión de Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4 max-w-lg mx-auto" encType="multipart/form-data">
        <h3 className="text-lg font-semibold">{editingProduct ? "Editar producto" : "Agregar nuevo producto"}</h3>
        <input type="text" name="name" placeholder="Nombre" value={newProduct.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="text" name="description" placeholder="Descripción" value={newProduct.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="number" name="price" placeholder="Precio" value={newProduct.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        {newProduct.preview && (<div className="mt-2"><p className="text-gray-700 mb-1">Preview de imagen:</p><img src={newProduct.preview} alt="Preview" className="h-24 w-24 object-cover rounded border"/></div>)}

        <div className="flex space-x-2">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">{editingProduct ? "Actualizar Producto" : "Crear Producto"}</button>
          {editingProduct && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      {/* Tabla */}
      <div className="max-h-96 overflow-y-auto border rounded-lg shadow overflow-hidden">
        <table className="min-w-full border border-gray-200 rounded-lg border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-0 z-20 bg-gray-200 px-6 py-3 text-left text-gray-700 font-bold">Imagen</th>
              <th className="sticky top-0 z-20 bg-gray-200 px-6 py-3 text-left text-gray-700 font-bold">
                {!nameFilterActive ? (
                  <div className="flex items-center gap-2">
                    <span>Nombre</span>
                    <button type="button" onClick={() => setNameFilterActive(true)} className="text-gray-600 hover:text-gray-900" aria-label="Filtrar por nombre" title="Filtrar por nombre">
                      🔍
                    </button>
                  </div>
                ) : (
                  <input ref={nameFilterInputRef} type="text" placeholder="Filtrar nombre..." value={filter} onChange={(e) => setFilter(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setNameFilterActive(false)} onBlur={() => setNameFilterActive(false)} className="bg-white border border-gray-300 rounded px-2 py-1 text-sm max-w-[200px]" />
                )}
              </th>
              <th className="sticky top-0 z-20 bg-gray-200 px-6 py-3 text-left text-gray-700 font-bold">Precio</th>
              <th className="sticky top-0 z-20 bg-gray-200 px-6 py-3 text-left text-gray-700 font-bold">Stock</th>
              <th className="sticky top-0 z-20 bg-gray-200 px-6 py-3 text-left text-gray-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-100 transition-colors">
                <td className="px-6 py-4">{p.image && <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded"/>}</td>
                <td className="px-6 py-4">{p.name}</td>
                <td className="px-6 py-4">${formatPrice(p.price)}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                  <span className="cursor-pointer hover:underline hover:text-blue-800" onClick={() => handleEdit(p)}>Editar</span>
                  <span className="mx-1">/</span>
                  <span className="cursor-pointer hover:underline hover:text-red-600" onClick={() => handleDelete(p._id)}>Eliminar</span>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No se encontraron productos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-3">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
        <span className="px-3 py-1">{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  );
}
