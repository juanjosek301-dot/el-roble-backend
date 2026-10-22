import type { PrismaClient } from "../../../infrastructure/database/generated/client.js";
import type { Product, ProductFilters, ProductRepository } from "../domain/product.js";

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(filters: ProductFilters): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: this.where(filters),
      orderBy: { id: "asc" },
      skip: filters.skip,
      take: filters.take,
    });
    return rows.map((row) => this.toDomain(row));
  }

  count(filters: Pick<ProductFilters, "categoria" | "buscar">): Promise<number> {
    return this.prisma.product.count({ where: this.where(filters) });
  }

  async findById(id: number): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  private where(filters: Pick<ProductFilters, "categoria" | "buscar">) {
    return {
      ...(filters.categoria ? { categoria: filters.categoria } : {}),
      ...(filters.buscar
        ? { nombre: { contains: filters.buscar, mode: "insensitive" as const } }
        : {}),
    };
  }

  private toDomain(row: { id: number; nombre: string; precio: { toNumber(): number }; categoria: string; imagen: string }): Product {
    return {
      id: row.id,
      nombre: row.nombre,
      precio: row.precio.toNumber(),
      categoria: row.categoria,
      imagen: row.imagen,
    };
  }
}
