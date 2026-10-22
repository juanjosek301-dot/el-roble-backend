import type { NextFunction, Request, Response } from "express";
import { GetProductUseCase } from "../../application/get-product.use-case.js";
import { ListProductsUseCase } from "../../application/list-products.use-case.js";

export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
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
      response.json(await this.getProduct.execute(request.params.id ?? ""));
    } catch (error) {
      next(error);
    }
  };
}
