import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../services/productService";
import type { Product } from "../models/Product";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", brand: "", description: "", price: "" });
  const [editing, setEditing] = useState<Product | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔍 Validación antes de enviar
    if (!form.name.trim() || !form.brand.trim() || !form.price.trim()) {
      setAlert("⚠️ Todos los campos obligatorios deben completarse");
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (parseFloat(form.price) <= 0) {
      setAlert("⚠️ El precio debe ser mayor que 0");
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      if (editing) {
        const updated = await updateProduct(editing.id, {
          name: form.name,
          brand: form.brand,
          description: form.description,
          price: parseFloat(form.price),
        });
        setProducts(products.map(p => (p.id === editing.id ? updated : p)));
        setEditing(null);
        setAlert("✅ Producto actualizado correctamente");
      } else {
        const newProduct = await createProduct({
          name: form.name,
          brand: form.brand,
          description: form.description,
          price: parseFloat(form.price),
        });
        setProducts([...products, newProduct]);
        setAlert("✅ Producto agregado correctamente");
      }

      setForm({ name: "", brand: "", description: "", price: "" });
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setAlert("❌ Error al guardar producto");
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: String(product.price),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">📦 Gestión de Productos</h1>

      {alert && (
        <div
          className={`mb-4 p-2 rounded text-center font-medium ${
            alert.startsWith("✅")
              ? "bg-green-200 text-green-800"
              : alert.startsWith("⚠️")
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {alert}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded shadow">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" className="border p-2 rounded" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Precio" className="border p-2 rounded" />

        <button
          type="submit"
          className={`col-span-full py-2 rounded text-white ${
            editing ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editing ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}
