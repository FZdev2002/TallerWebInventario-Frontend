import { useEffect, useState } from "react";
import { getLots } from "../services/lotService";
import type { Lot } from "../models/Lot";

export default function InventoryReportPage() {
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    getLots().then(setLots).catch(console.error);
  }, []);

  const storeNames: Record<number, string> = {
    1: "Main Store",
    2: "Warehouse",
    3: "Outlet",
  };

  // Agrupar lotes por sucursal
  const lotsByStore = lots.reduce<Record<number, Lot[]>>((acc, lot) => {
    acc[lot.storeId] = acc[lot.storeId] || [];
    acc[lot.storeId].push(lot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">📦 Conteo de Inventario por Sucursal</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(lotsByStore).map(([storeId, storeLots]) => (
          <div key={storeId} className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              🏬 {storeNames[Number(storeId)]}
            </h2>
            <p className="text-gray-700">
              Total de lotes: <strong>{storeLots.length}</strong>
            </p>
            <ul className="mt-2 text-sm text-gray-600">
              {storeLots.map((lot) => (
                <li key={lot.id}>
                  • Lote #{lot.id} (Producto {lot.productId}) vence {lot.expiration}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
