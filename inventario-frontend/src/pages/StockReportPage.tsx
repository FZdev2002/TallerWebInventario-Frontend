import { useEffect, useState } from "react";
import { getLots } from "../services/lotService";
import { getProducts } from "../services/productService";
import type { Lot } from "../models/Lot";
import type { Product } from "../models/Product";

export default function StockReportPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sucursales estáticas
  const stores = {
    1: "Main Store",
    2: "Warehouse",
    3: "Outlet",
  };

  useEffect(() => {
    Promise.all([getLots(), getProducts()])
      .then(([lotsData, productsData]) => {
        setLots(lotsData);
        setProducts(productsData);
      })
      .catch((err) => console.error("Error al cargar datos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando reporte...</div>;
  }

  const grouped = lots.reduce((acc, lot) => {
    const storeName = stores[lot.storeId as keyof typeof stores] || "Desconocida";
    const product = products.find((p) => p.id === lot.productId);
    const productName = product ? `${product.name} (${product.brand})` : `Producto #${lot.productId}`;

    if (!acc[storeName]) acc[storeName] = {};
    if (!acc[storeName][productName]) acc[storeName][productName] = [];

    acc[storeName][productName].push(lot);
    return acc;
  }, {} as Record<string, Record<string, Lot[]>>);

  const getNearestExpiration = (lots: Lot[]) => {
    const validDates = lots
      .map((l) => new Date(l.expiration))
      .filter((d) => !isNaN(d.getTime()));
    if (validDates.length === 0) return "Sin fecha";
    const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
    return minDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        📊 Reporte de Stock por Sucursal
      </h1>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-600">No hay lotes registrados.</p>
      ) : (
        Object.entries(grouped).map(([storeName, products]) => (
          <div key={storeName} className="mb-8 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              {storeName}
            </h2>

            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border text-center">Cantidad de Lotes</th>
                  <th className="p-2 border text-center">Fecha más próxima de vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(products).map(([productName, productLots]) => (
                  <tr key={productName} className="border-b hover:bg-gray-50">
                    <td className="p-2">{productName}</td>
                    <td className="p-2 text-center">{productLots.length}</td>
                    <td className="p-2 text-center">{getNearestExpiration(productLots)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
