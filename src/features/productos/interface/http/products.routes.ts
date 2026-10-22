import { Router } from "express";
import { authenticate, requireRole } from "../../../../common/interface/http/middleware/authentication.js";
import { prisma } from "../../../../infrastructure/database/client.js";
import { GetProductUseCase } from "../../application/get-product.use-case.js";
import { ListProductsUseCase } from "../../application/list-products.use-case.js";
import { CreateProductUseCase, DeleteProductUseCase, UpdateProductUseCase } from "../../application/manage-products.use-cases.js";
import { PrismaProductRepository } from "../../infrastructure/prisma-product.repository.js";
import { ProductsController } from "./products.controller.js";

const repository = new PrismaProductRepository(prisma);
const controller = new ProductsController(
  new ListProductsUseCase(repository),
  new GetProductUseCase(repository),
  new CreateProductUseCase(repository),
  new UpdateProductUseCase(repository),
  new DeleteProductUseCase(repository),
);

export const productsRouter = Router();
productsRouter.get("/", controller.list);
productsRouter.get("/:id", controller.getById);
productsRouter.post("/", authenticate, requireRole("admin"), controller.create);
productsRouter.put("/:id", authenticate, requireRole("admin"), controller.update);
productsRouter.delete("/:id", authenticate, requireRole("admin"), controller.delete);