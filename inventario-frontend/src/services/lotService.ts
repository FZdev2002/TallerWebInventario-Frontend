import type { Lot } from "../models/Lot";

const API_URL = "http://localhost:8080/api/lot";

export async function getLots(): Promise<Lot[]> {
  const res = await fetch(API_URL);

  // Si la respuesta es texto, la ignoramos sin romper la app
  const contentType = res.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      console.warn("⚠️ Respuesta no JSON del backend:", text);
      return []; // Devuelve lista vacía si no hay JSON
    }
  } catch (err) {
    console.error("❌ Error al procesar respuesta de lotes:", err);
    return [];
  }
}

export async function createLot(lot: {
  productId: number;
  storeId: number;
  expiration: string;
}): Promise<any> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lot),
  });

  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      console.warn("⚠️ Respuesta no JSON del backend:", text);
      return null;
    }
  } catch (err) {
    console.error("❌ Error al crear lote:", err);
    return null;
  }
}

export async function deleteLot(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar lote");
}
