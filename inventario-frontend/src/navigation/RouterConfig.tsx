import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import LotsPage from "../pages/LotsPage";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex gap-6">
      <Link to="/productos" className="hover:underline">Productos</Link>
      <Link to="/lotes" className="hover:underline">Lotes</Link>
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
      </Routes>
    </BrowserRouter>
  );
}
