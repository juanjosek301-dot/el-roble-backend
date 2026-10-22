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

export interface ProductRepository {
  list(filters: ProductFilters): Promise<Product[]>;
  count(filters: Pick<ProductFilters, "categoria" | "buscar">): Promise<number>;
  findById(id: number): Promise<Product | null>;
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
