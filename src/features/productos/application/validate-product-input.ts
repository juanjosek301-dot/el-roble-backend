import { HttpError } from "../../../common/application/http-error.js";
import type { ProductInput } from "../domain/product.js";

const categories = new Set(["abarrotes", "bebidas", "aseo", "lacteos", "snacks"]);

export function validateProductInput(input: Record<string, unknown>): ProductInput {
  const nombre = typeof input.nombre === "string" ? input.nombre.trim() : "";
  const categoria = typeof input.categoria === "string" ? input.categoria.trim() : "";
  const imagen = typeof input.imagen === "string" ? input.imagen.trim() : "";
  const precio = input.precio;

  if (nombre.length < 1 || nombre.length > 120) {
    throw new HttpError(400, "El nombre del producto debe tener entre 1 y 120 caracteres.");
  }
  if (typeof precio !== "number" || !Number.isFinite(precio) || precio <= 0 || precio >= 100_000_000) {
    throw new HttpError(400, "El precio debe ser un número mayor que cero.");
  }
  if (!categories.has(categoria)) {
    throw new HttpError(400, "La categoría seleccionada no es válida.");
  }
  try {
    const url = new URL(imagen);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("URL no admitida");
  } catch {
    throw new HttpError(400, "La imagen debe tener una URL http o https válida.");
  }

  return { nombre, precio, categoria, imagen };
}

export function parseProductId(rawId: unknown): number {
  const id = typeof rawId === "string" ? Number(rawId) : Number.NaN;
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "El identificador del producto no es válido.");
  return id;
}