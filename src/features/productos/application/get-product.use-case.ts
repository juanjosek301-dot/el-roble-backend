import { HttpError } from "../../../common/application/http-error.js";
import type { ProductRepository } from "../domain/product.js";
import { parseProductId } from "./validate-product-input.js";

export class GetProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(rawId: string) {
    const product = await this.products.findById(parseProductId(rawId));
    if (!product) throw new HttpError(404, "No se encontró el producto.");
    return product;
  }
}