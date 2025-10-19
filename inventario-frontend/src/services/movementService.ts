const API_URL = "http://localhost:8080/api/movement";

export async function getMovements() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener movimientos");
    return await res.json();
  } catch (err) {
    console.error("Error en getMovements:", err);
    throw err;
  }
}

export async function createMovement(storeId: number, lotId: number, movementType: "SENT" | "RECEIVED") {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, lotId, movementType }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al registrar movimiento:", text);
    throw new Error(text);
  }

  return await res.json();
}