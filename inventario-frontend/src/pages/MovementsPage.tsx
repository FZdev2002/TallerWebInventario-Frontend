import { useEffect, useState } from "react";
import { getMovements } from "../services/movementService";
import type { Movement } from "../models/Movement";

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    getMovements().then(setMovements).catch(console.error);
  }, []);

  const storeNames: Record<number, string> = {
    1: "Main Store",
    2: "Warehouse",
    3: "Outlet",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">📋 Reporte de Movimientos</h1>

      <div className="bg-white p-4 rounded shadow">
        {movements.length === 0 ? (
          <p className="text-gray-600">No hay movimientos registrados.</p>
        ) : (
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Sucursal</th>
                <th className="border p-2">Lote</th>
                <th className="border p-2">Tipo de Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="text-center">
                  <td className="border p-2">{m.id}</td>
                  <td className="border p-2">{storeNames[m.storeId] || "Desconocida"}</td>
                  <td className="border p-2">{m.lotId}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      m.movementType === "RECEIVED"
                        ? "text-green-700"
                        : m.movementType === "SENT"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {m.movementType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
