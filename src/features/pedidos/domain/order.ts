export type PaymentMethod = "efectivo" | "nequi";

export interface CreateOrderInput {
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  productos: Array<{ productoId: number; cantidad: number }>;
  metodoPago: PaymentMethod;
  observaciones?: string;
}

export interface OrderRepository {
  create(userId: string, input: CreateOrderInput): Promise<unknown>;
  listByUser(userId: string): Promise<unknown[]>;
  listAll(): Promise<unknown[]>;
}
