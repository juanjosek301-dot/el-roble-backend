import { HttpError } from "../../../common/application/http-error.js";
import type { Product, ProductRepository } from "../domain/product.js";
import { parseProductId, validateProductInput } from "./validate-product-input.js";

export class CreateProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  execute(input: Record<string, unknown>): Promise<Product> {
    return this.products.create(validateProductInput(input));
  }
}

export class UpdateProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(rawId: unknown, input: Record<string, unknown>): Promise<Product> {
    const product = await this.products.update(
      parseProductId(rawId),
      validateProductInput(input),
    );
    if (!product) throw new HttpError(404, "No se encontró el producto.");
    return product;
  }
}

export class DeleteProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(rawId: unknown): Promise<void> {
    const deleted = await this.products.delete(parseProductId(rawId));
    if (!deleted) throw new HttpError(404, "No se encontró el producto.");
  }
}