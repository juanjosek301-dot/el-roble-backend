export interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

export interface ProductFilters {
  categoria?: string;
  buscar?: string;
  skip: number;
  take: number;
}

export type ProductInput = Omit<Product, "id">;

export interface ProductRepository {
  list(filters: ProductFilters): Promise<Product[]>;
  count(filters: Pick<ProductFilters, "categoria" | "buscar">): Promise<number>;
  findById(id: number): Promise<Product | null>;
  create(input: ProductInput): Promise<Product>;
  update(id: number, input: ProductInput): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}

export interface ProductPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedProducts {
  pagination: ProductPagination;
  data: Product[];
}