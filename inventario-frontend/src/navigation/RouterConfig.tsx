import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import LotsPage from "../pages/LotsPage";
import StockReportPage from "../pages/StockReportPage";
import MovementsPage from "../pages/MovementsPage";
import InventoryReportPage from "../pages/InventoryReportPage";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex gap-6">
      <Link to="/productos" className="hover:underline">Productos</Link>
      <Link to="/lotes" className="hover:underline">Lotes</Link>
      <Link to="/reporte-stock" className="hover:underline">Reporte</Link>
      <Link to="/movimientos" className="hover:underline">Movimientos</Link>
      <Link to="/reporte-inventario" className="hover:underline">Reporte de Inventario</Link>
    </nav>
  );
}

export default function RouterConfig() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/lotes" element={<LotsPage />} />
        <Route path="/reporte-stock" element={<StockReportPage />} />
        <Route path="/movimientos" element={<MovementsPage />} />
        <Route path="/reporte-inventario" element={<InventoryReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
