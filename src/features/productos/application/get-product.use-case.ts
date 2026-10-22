import { HttpError } from "../../../common/application/http-error.js";
import type { ProductRepository } from "../domain/product.js";

export class GetProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) {
      throw new HttpError(400, "El identificador del producto no es válido.");
    }

    const product = await this.products.findById(id);
    if (!product) throw new HttpError(404, "No se encontró el producto.");
    return product;
  }
}
