import { Router } from "express";
import { authenticate, requireRole } from "../../../../common/interface/http/middleware/authentication.js";
import { prisma } from "../../../../infrastructure/database/client.js";
import { CreateOrderUseCase } from "../../application/create-order.use-case.js";
import { ListOrdersUseCase } from "../../application/list-orders.use-case.js";
import { PrismaOrderRepository } from "../../infrastructure/prisma-order.repository.js";
import { OrdersController } from "./orders.controller.js";

const repository = new PrismaOrderRepository(prisma);
const controller = new OrdersController(new CreateOrderUseCase(repository), new ListOrdersUseCase(repository));

export const ordersRouter = Router();
ordersRouter.post("/", authenticate, controller.create);
ordersRouter.get("/mias", authenticate, controller.mine);
ordersRouter.get("/", authenticate, requireRole("admin"), controller.all);
