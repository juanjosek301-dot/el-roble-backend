import { Router } from "express";
import { GetProductUseCase } from "../../application/get-product.use-case.js";
import { ListProductsUseCase } from "../../application/list-products.use-case.js";
import { prisma } from "../../../../infrastructure/database/client.js";
import { PrismaProductRepository } from "../../infrastructure/prisma-product.repository.js";
import { ProductsController } from "./products.controller.js";

const repository = new PrismaProductRepository(prisma);
const controller = new ProductsController(
  new ListProductsUseCase(repository),
  new GetProductUseCase(repository),
);

export const productsRouter = Router();
productsRouter.get("/", controller.list);
productsRouter.get("/:id", controller.getById);
