import type { PaginatedProducts, ProductFilters, ProductRepository } from "../domain/product.js";
import { HttpError } from "../../../common/application/http-error.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function parsePositiveInteger(value: unknown, fallback: number, field: string, maximum?: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || (maximum !== undefined && parsed > maximum)) {
    throw new HttpError(400, `${field} debe ser un número entero entre 1 y ${maximum ?? "un valor válido"}.`);
  }
  return parsed;
}

export class ListProductsUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(query: Record<string, unknown>): Promise<PaginatedProducts> {
    const page = parsePositiveInteger(query.page, 1, "page");
    const limit = parsePositiveInteger(query.limit, DEFAULT_LIMIT, "limit", MAX_LIMIT);
    const categoria = typeof query.categoria === "string" ? query.categoria.trim() : undefined;
    const buscar = typeof query.buscar === "string" ? query.buscar.trim() : undefined;
    const filters: ProductFilters = {
      ...(categoria ? { categoria } : {}),
      ...(buscar ? { buscar } : {}),
      skip: (page - 1) * limit,
      take: limit,
    };

    const countFilters = { categoria: filters.categoria, buscar: filters.buscar };
    const [data, totalItems] = await Promise.all([
      this.products.list(filters),
      this.products.count(countFilters),
    ]);

    return {
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
      data,
    };
  }
}
