import { useEffect, useState } from "react";
import { getLots, createLot, deleteLot } from "../services/lotService";
import { getProducts } from "../services/productService";
import type { Lot } from "../models/Lot";
import type { Product } from "../models/Product";
import LotCard from "../components/LotCard";

export default function LotsPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ productId: "", storeId: "", expiration: "" });
  const [message, setMessage] = useState<string | null>(null); // mensaje visual

useEffect(() => {
  getLots().then(setLots).catch((err) => console.error("❌ Error al obtener lotes:", err));
  getProducts().then(setProducts).catch((err) => console.error("❌ Error al obtener productos:", err));
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newLot = await createLot({
        productId: Number(form.productId),
        storeId: Number(form.storeId),
        expiration: form.expiration,
      });

      if (newLot && typeof newLot === "object" && "id" in newLot) {
        setLots([...lots, newLot]);
        setMessage("✅ Lote creado correctamente");
      } else {
        setMessage("✅ Lote registrado (respuesta no JSON)");
      }

      setForm({ productId: "", storeId: "", expiration: "" });
    } catch (error) {
      console.error("❌ Error al crear lote:", error);
      setMessage("❌ Error al crear el lote");
    }

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    await deleteLot(id);
    setLots(lots.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">📦 Registro de Lotes</h1>

      {message && (
        <div
          className={`mb-4 p-2 rounded text-center font-medium ${
            message.startsWith("✅") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded shadow"
      >
        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.brand})
            </option>
          ))}
        </select>

        <select
          name="storeId"
          value={form.storeId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione sucursal</option>
          <option value="1">Main Store</option>
          <option value="2">Warehouse</option>
          <option value="3">Outlet</option>
        </select>

        <input
          name="expiration"
          type="date"
          value={form.expiration}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="col-span-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Agregar Lote
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {lots.map((l) => (
          <LotCard key={l.id} lot={l} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
