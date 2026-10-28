import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../../../../common/application/http-error.js";
import { CreateOrderUseCase } from "../../application/create-order.use-case.js";
import { ListOrdersUseCase } from "../../application/list-orders.use-case.js";

export class OrdersController {
  constructor(private readonly createOrder: CreateOrderUseCase, private readonly listOrders: ListOrdersUseCase) {}

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.auth) throw new HttpError(401, "Debes iniciar sesión para realizar un pedido.");
      response.status(201).json(await this.createOrder.execute(request.auth.userId, request.body));
    } catch (error) { next(error); }
  };

  mine = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.auth) throw new HttpError(401, "Debes iniciar sesión para consultar tus pedidos.");
      response.json({ data: await this.listOrders.listByUser(request.auth.userId) });
    } catch (error) { next(error); }
  };

  all = async (_request: Request, response: Response, next: NextFunction) => {
    try { response.json({ data: await this.listOrders.listAll() }); }
    catch (error) { next(error); }
  };
}
