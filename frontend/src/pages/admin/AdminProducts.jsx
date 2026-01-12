import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/formatPrice";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    preview: null,
  });
  const fileInputRef = useRef(null);

  const [filter, setFilter] = useState("");
  const [nameFilterActive, setNameFilterActive] = useState(false);
  const nameFilterInputRef = useRef(null);

  const fetchTableProducts = async (pageNumber = 1) => {
  try {
    setLoading(true);

    const { data } = await axios.get(
      `${API_BASE_URL}/api/products?page=${pageNumber}&limit=6`
    );

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
    fetchTableProducts(page);
  }, [page]);

  useEffect(() => {
    if (nameFilterActive && nameFilterInputRef.current) {
      nameFilterInputRef.current.focus();
    }
  }, [nameFilterActive]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (newProduct.preview) URL.revokeObjectURL(newProduct.preview);
      const file = files[0];
      setNewProduct({
        ...newProduct,
        image: file || null,
        preview: file ? URL.createObjectURL(file) : null,
      });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const resetForm = () => {
    if (newProduct.preview) URL.revokeObjectURL(newProduct.preview);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
      preview: null,
    });
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

  if (newProduct.image instanceof File) {
    formData.append("image", newProduct.image);
  }

  try {
    let res;

    if (editingProduct) {
      res = await axios.put(
        `${API_BASE_URL}/api/products/${editingProduct._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      res = await axios.post(
        `${API_BASE_URL}/api/products`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    const savedProduct = res.data;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === savedProduct._id ? savedProduct : p
        )
      );
      toast.success("Producto actualizado");
    } else {
      setProducts((prev) => [savedProduct, ...prev]);
      toast.success("Producto creado");
    }

    resetForm();
  } catch (err) {
    console.error(err);
    toast.error(
      editingProduct
        ? "No se pudo actualizar el producto"
        : "No se pudo crear el producto"
    );
  }
};

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image || null,
      preview: product.image || null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "¿Eliminar producto?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.delete(
      `${API_BASE_URL}/api/products/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.success("Producto eliminado");
  } catch (err) {
    console.error(err);
    toast.error("No se pudo eliminar el producto");
  }
};

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p className="text-gray-600">Cargando productos...</p>;

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-700">
        Gestión de Productos
      </h2>

      {/* Formulario */}
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md mb-10 space-y-4 max-w-xl mx-auto flex flex-col items-center border border-gray-200 hover:shadow-lg transition-shadow"
      encType="multipart/form-data"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingProduct ? "Editar producto" : "Agregar nuevo producto"}
      </h3>

      {/* Nombre */}
      <div className="w-full">
        {editingProduct && <label className="text-xs text-gray-500">Nombre</label>}
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      {/* Descripción */}
      <div className="w-full">
        {editingProduct && <label className="text-xs text-gray-500">Descripción</label>}
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      {/* Precio */}
      <div className="w-full">
        {editingProduct && <label className="text-xs text-gray-500">Precio</label>}
        <div className="flex items-center border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="text-gray-500 mr-1">$</span>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={newProduct.price}
            onChange={handleChange}
            className="w-full focus:outline-none"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="w-full">
        {editingProduct && <label className="text-xs text-gray-500">Stock</label>}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      {/* Imagen */}
      <div className="w-full">
        {editingProduct && <label className="text-xs text-gray-500">Imagen</label>}
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
           required={!editingProduct}
        />
      </div>

      {/* Preview */}
      {newProduct.preview && (
        <div className="mt-3 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
          <img
            src={newProduct.preview}
            alt="Preview"
            className="h-16 w-16 object-cover rounded-lg shadow"
          />
          <span className="text-sm text-gray-600">Vista previa</span>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-center gap-3 pt-3">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 hover:shadow-md transition-all"
        >
          {editingProduct ? "Actualizar Producto" : "Crear Producto"}
        </button>
        {editingProduct && (
          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            onClick={resetForm}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>


    {/* Tabla */}
    <div className="border rounded-xl shadow-md overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
            <tr>
              <th className="w-[12%] px-4 py-2 font-semibold text-gray-700 border-b text-center">
                Imagen
              </th>
              <th className="w-[33%] px-4 py-2 font-semibold text-gray-700 border-b text-left">
                {!nameFilterActive ? (
                  <div className="flex items-center gap-2">
                    <span>Nombre</span>
                    <button
                      type="button"
                      onClick={() => setNameFilterActive(true)}
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Filtrar por nombre"
                      title="Filtrar por nombre"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <input
                    ref={nameFilterInputRef}
                    type="text"
                    placeholder="Filtrar nombre..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Escape" && setNameFilterActive(false)
                    }
                    onBlur={() => setNameFilterActive(false)}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-[180px] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </th>
              <th className="w-[15%] px-4 py-2 font-semibold text-gray-700 border-b text-center">
                Precio
              </th>
              <th className="w-[15%] px-4 py-2 font-semibold text-gray-700 border-b text-center">
                Stock
              </th>
              <th className="w-[25%] px-4 py-2 font-semibold text-gray-700 border-b text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody data-test="tabla-products" className="divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-indigo-50 transition even:bg-gray-50"
                >
                  <td className="px-4 py-3 text-center" data-test="cy-image">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded-lg shadow-sm mx-auto"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium truncate" data-test="cy-name">{p.name}</td>
                  <td className="px-4 py-3 text-center" data-test="cy-price">${formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-center" data-test="cy-stock">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-6 text-center text-gray-500 bg-white"
                >
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>



      {/* Paginación */}
      <div className="flex items-center gap-2 justify-center mt-6">
        <button
          disabled={page <= 1 || filter}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          ‹
        </button>

        {Array.from({ length: filter ? 1 : totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              page === i + 1
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page >= totalPages || filter}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          ›
        </button>
      </div>
    </div>
  );
}