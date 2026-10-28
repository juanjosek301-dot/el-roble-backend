import type { PrismaClient } from "../../../infrastructure/database/generated/client.js";
import { HttpError } from "../../../common/application/http-error.js";
import type { CreateOrderInput, OrderRepository } from "../domain/order.js";

const orderSelection = {
  id: true,
  createdAt: true,
  estado: true,
  total: true,
  metodoPago: true,
  productos: { select: { productoId: true, nombre: true, precio: true, cantidad: true } },
} as const;

function presentOrder(order: any) {
  return {
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    estado: order.estado,
    total: Number(order.total),
    metodoPago: order.metodoPago,
    productos: order.productos.map((item: any) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      precio: Number(item.precio),
      cantidad: item.cantidad,
    })),
  };
}

export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, input: CreateOrderInput) {
    return this.db.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: input.productos.map((item) => item.productoId) } },
        select: { id: true, nombre: true, precio: true },
      });
      if (products.length !== input.productos.length) {
        throw new HttpError(404, "Uno o más productos ya no están disponibles.");
      }
      const byId = new Map(products.map((product) => [product.id, product]));
      const items = input.productos.map((item) => {
        const product = byId.get(item.productoId);
        if (!product) throw new HttpError(404, "Uno o más productos ya no están disponibles.");
        return {
          productoId: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: item.cantidad,
        };
      });
      const total = items.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
      const order = await tx.order.create({
        data: {
          userId,
          clienteNombre: input.cliente.nombre,
          clienteEmail: input.cliente.email,
          telefono: input.cliente.telefono,
          direccion: input.cliente.direccion,
          metodoPago: input.metodoPago,
          observaciones: input.observaciones || null,
          total: total.toFixed(2),
          productos: { create: items },
        },
        select: orderSelection,
      });
      return presentOrder(order);
    });
  }

  async listByUser(userId: string) {
    const orders = await this.db.order.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, select: orderSelection,
    });
    return orders.map(presentOrder);
  }

  async listAll() {
    const orders = await this.db.order.findMany({
      orderBy: { createdAt: "desc" }, select: { ...orderSelection, userId: true, clienteNombre: true, clienteEmail: true, telefono: true, direccion: true },
    });
    return orders.map((order) => ({ ...presentOrder(order), usuarioId: order.userId, cliente: { nombre: order.clienteNombre, email: order.clienteEmail, telefono: order.telefono, direccion: order.direccion } }));
  }
}

