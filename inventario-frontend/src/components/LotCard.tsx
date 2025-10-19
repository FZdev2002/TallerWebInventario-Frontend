import { useState } from "react";
import type { Lot } from "../models/Lot";
import { createMovement } from "../services/movementService";

interface Props {
  lot: Lot;
  onDelete: (id: number) => void;
}

export default function LotCard({ lot, onDelete }: Props) {
  const [showMove, setShowMove] = useState(false);
  const [newStore, setNewStore] = useState("");
  const [currentStore, setCurrentStore] = useState(lot.storeId);
  const [message, setMessage] = useState<string | null>(null);

  const stores = [
    { id: 1, name: "Main Store" },
    { id: 2, name: "Warehouse" },
    { id: 3, name: "Outlet" },
  ];

  const handleMove = async () => {
    if (!newStore) {
      setMessage("⚠️ Debe seleccionar una sucursal de destino");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (Number(newStore) === currentStore) {
      setMessage("⚠️ La sucursal de destino debe ser diferente");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      // Registrar los movimientos en el backend
      await createMovement(currentStore, lot.id, "SENT");
      await createMovement(Number(newStore), lot.id, "RECEIVED");

      // Actualizar la sucursal del lote en memoria
      setCurrentStore(Number(newStore));
      setNewStore("");
      setShowMove(false);

      setMessage("✅ Lote movido correctamente");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("❌ Error al mover el lote:", error);
      setMessage("❌ Error al mover el lote");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow border border-gray-200">
      <h2 className="font-semibold text-gray-800 mb-1">📦 Lote #{lot.id}</h2>
      <p className="text-sm text-gray-600">Producto ID: {lot.productId}</p>
      <p className="text-sm text-gray-600">
        🏬 Sucursal actual: {stores.find((s) => s.id === currentStore)?.name}
      </p>
      <p className="text-sm text-gray-600">📅 Vence: {lot.expiration}</p>

      {message && (
        <p
          className={`mt-2 text-sm font-medium ${
            message.startsWith("✅")
              ? "text-green-700"
              : message.startsWith("⚠️")
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onDelete(lot.id)}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
        >
          Eliminar
        </button>

        <button
          onClick={() => setShowMove(!showMove)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
        >
          Mover
        </button>
      </div>

      {showMove && (
        <div className="mt-3 border-t pt-2">
          <label className="text-sm text-gray-700">Seleccionar nueva sucursal:</label>
          <select
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
            className="border p-1 rounded w-full mt-1"
          >
            <option value="">Seleccione...</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleMove}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm w-full"
          >
            Confirmar movimiento
          </button>
        </div>
      )}
    </div>
  );
}
