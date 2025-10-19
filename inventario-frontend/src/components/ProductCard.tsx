import { type Product } from "../models/Product";

interface Props {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit }: Props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.brand}</p>
      <p className="text-sm text-gray-500 italic">{product.description}</p>
      <p className="mt-2 font-bold text-blue-600">${product.price}</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
