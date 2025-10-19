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
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getLots().then(setLots).catch((err) => console.error("Error al obtener lotes:", err));
    getProducts().then(setProducts).catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.productId || !form.storeId || !form.expiration) {
      setMessage("⚠️ Todos los campos deben ser completados antes de registrar un lote");
      setTimeout(() => setMessage(null), 3500);
      return;
    }

    const selectedDate = new Date(form.expiration);
    const today = new Date();
    if (selectedDate <= today) {
      setMessage("⚠️ La fecha de vencimiento debe ser posterior al día actual");
      setTimeout(() => setMessage(null), 3500);
      return;
    }

    try {
      const newLot = await createLot({
        productId: Number(form.productId),
        storeId: Number(form.storeId),
        expiration: form.expiration,
      });

      if (newLot && typeof newLot === "object" && "id" in newLot) {
        setLots([...lots, newLot]);
        setMessage("✅ Lote registrado correctamente");
      } else {
        setMessage("✅ Lote guardado (respuesta no JSON)");
      }

      setForm({ productId: "", storeId: "", expiration: "" });
    } catch (error) {
      console.error("Error al crear lote:", error);
      setMessage("❌ Error al crear el lote");
    }

    setTimeout(() => setMessage(null), 3500);
  };

  const handleDelete = async (id: number) => {
    await deleteLot(id);
    setLots(lots.filter((l) => l.id !== id));
  };

  // Obtener lotes próximos a vencer
  const getExpiringLots = () => {
    const today = new Date();
    return lots.filter((l) => {
      const exp = new Date(l.expiration);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 15;
    });
  };

  const getExpiredLots = () => {
    const today = new Date();
    return lots.filter((l) => new Date(l.expiration) < today);
  };

  const expiringLots = getExpiringLots();
  const expiredLots = getExpiredLots();

  // Elimina automáticamente los lotes vencidos
  const handleDeleteExpired = async () => {
    if (expiredLots.length === 0) return;

    if (!confirm(`¿Seguro que deseas eliminar ${expiredLots.length} lote(s) vencido(s)?`)) return;

    for (const lot of expiredLots) {
      await deleteLot(lot.id);
    }

    setLots(lots.filter((l) => !expiredLots.includes(l)));
    setMessage("🗑️ Lotes vencidos eliminados correctamente");
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">📦 Registro de Lotes</h1>

      {message && (
        <div
          className={`mb-4 p-2 rounded text-center font-medium ${
            message.startsWith("✅")
              ? "bg-green-200 text-green-800"
              : message.startsWith("⚠️")
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {expiringLots.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded mb-5">
          ⚠️ <strong>Advertencia:</strong> Hay {expiringLots.length} lote(s) próximos a vencer.
          <ul className="mt-2 list-disc list-inside text-sm">
            {expiringLots.map((l) => (
              <li key={l.id}>
                Lote #{l.id} - Producto ID {l.productId} vence el {l.expiration}
              </li>
            ))}
          </ul>
        </div>
      )}

      {expiredLots.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-800 p-3 rounded mb-5">
          ❌ <strong>Hay {expiredLots.length} lote(s) vencido(s)</strong>
          <ul className="mt-2 list-disc list-inside text-sm">
            {expiredLots.map((l) => (
              <li key={l.id}>
                Lote #{l.id} - Producto ID {l.productId} (venció el {l.expiration})
              </li>
            ))}
          </ul>
          <button
            onClick={handleDeleteExpired}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            🗑️ Dar de baja lotes vencidos
          </button>
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
