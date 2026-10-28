import { HttpError } from "../../../common/application/http-error.js";
import type { CreateOrderInput, OrderRepository } from "../domain/order.js";

export class CreateOrderUseCase {
  constructor(private readonly orders: OrderRepository) {}

  execute(userId: string, input: unknown) {
    if (typeof input !== "object" || input === null) {
      throw new HttpError(400, "Los datos del pedido no son válidos.");
    }

    const body = input as Record<string, unknown>;
    const cliente = body.cliente;
    if (typeof cliente !== "object" || cliente === null) {
      throw new HttpError(400, "Debes ingresar los datos de contacto.");
    }
    const customer = cliente as Record<string, unknown>;
    const fields = ["nombre", "email", "telefono", "direccion"] as const;
    for (const field of fields) {
      if (typeof customer[field] !== "string" || !customer[field].trim()) {
        throw new HttpError(400, `El campo ${field} es obligatorio.`);
      }
    }
    if ((customer.nombre as string).trim().length > 100 || (customer.email as string).trim().length > 254 ||
        (customer.telefono as string).trim().length > 30 || (customer.direccion as string).trim().length > 250) {
      throw new HttpError(400, "Uno de los datos de contacto supera la longitud permitida.");
    }
    if (typeof customer.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      throw new HttpError(400, "El correo electrónico no tiene un formato válido.");
    }

    if (!Array.isArray(body.productos) || body.productos.length === 0) {
      throw new HttpError(400, "Selecciona al menos un producto.");
    }
    const productos = body.productos.map((item) => {
      if (typeof item !== "object" || item === null) throw new HttpError(400, "Hay un producto inválido en el pedido.");
      const value = item as Record<string, unknown>;
      if (!Number.isInteger(value.productoId) || (value.productoId as number) <= 0 ||
          !Number.isInteger(value.cantidad) || (value.cantidad as number) <= 0 || (value.cantidad as number) > 999) {
        throw new HttpError(400, "Cada producto debe tener un identificador y una cantidad válida.");
      }
      return { productoId: value.productoId as number, cantidad: value.cantidad as number };
    });
    if (new Set(productos.map(({ productoId }) => productoId)).size !== productos.length) {
      throw new HttpError(400, "No repitas productos en el pedido.");
    }
    if (body.metodoPago !== "efectivo" && body.metodoPago !== "nequi") {
      throw new HttpError(400, "El método de pago debe ser efectivo o Nequi.");
    }
    const observaciones = body.observaciones === undefined ? "" : body.observaciones;
    if (typeof observaciones !== "string" || observaciones.length > 1000) {
      throw new HttpError(400, "Las observaciones no pueden superar 1000 caracteres.");
    }

    const order: CreateOrderInput = {
      cliente: {
        nombre: (customer.nombre as string).trim(),
        email: (customer.email as string).trim().toLowerCase(),
        telefono: (customer.telefono as string).trim(),
        direccion: (customer.direccion as string).trim(),
      },
      productos,
      metodoPago: body.metodoPago,
      observaciones: observaciones.trim(),
    };
    return this.orders.create(userId, order);
  }
}
