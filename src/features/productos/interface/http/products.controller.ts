import type { NextFunction, Request, Response } from "express";
import { CreateProductUseCase, DeleteProductUseCase, UpdateProductUseCase } from "../../application/manage-products.use-cases.js";
import { GetProductUseCase } from "../../application/get-product.use-case.js";
import { ListProductsUseCase } from "../../application/list-products.use-case.js";

export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
  ) {}

  list = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await this.listProducts.execute(request.query));
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = request.params.id;
      response.json(await this.getProduct.execute(typeof id === "string" ? id : ""));
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.status(201).json(await this.createProduct.execute(request.body ?? {}));
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await this.updateProduct.execute(request.params.id, request.body ?? {}));
    } catch (error) {
      next(error);
    }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await this.deleteProduct.execute(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}