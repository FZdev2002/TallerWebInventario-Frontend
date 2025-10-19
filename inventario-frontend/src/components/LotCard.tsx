import type { Lot } from "../models/Lot";

interface Props {
  lot: Lot;
  onDelete: (id: number) => void;
}

export default function LotCard({ lot, onDelete }: Props) {
  const daysLeft = Math.ceil(
    (new Date(lot.expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysLeft <= 7;

  return (
    <div
      className={`p-4 rounded-lg shadow-md border transition ${
        isExpiringSoon ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800">🧾 Lote #{lot.id}</h3>
      <p className="text-sm text-gray-600">Producto ID: {lot.productId}</p>
      <p className="text-sm text-gray-600">Sucursal ID: {lot.storeId}</p>
      <p className="text-sm text-gray-600">
        Vence: <span className="font-medium">{lot.expiration}</span>
      </p>

      {isExpiringSoon && (
        <p className="text-red-600 font-semibold mt-1">
          ⚠️ Lote por vencer ({daysLeft} días restantes)
        </p>
      )}

      <button
        onClick={() => onDelete(lot.id)}
        className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Eliminar
      </button>
    </div>
  );
}
