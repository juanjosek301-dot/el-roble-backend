import type { OrderRepository } from "../domain/order.js";

export class ListOrdersUseCase {
  constructor(private readonly orders: OrderRepository) {}
  listByUser(userId: string) { return this.orders.listByUser(userId); }
  listAll() { return this.orders.listAll(); }
}
